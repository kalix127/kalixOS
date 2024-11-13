import {
  defaultFileSystem,
  defaultApps,
  defaultDimScreenThreshold,
  defaultBookmarks,
} from "@/constants";
import { findNodeByIdRecursive, getNodeIcon } from "@/helpers";
import type { AppNode, FileSystemNode } from "~/types";
import { findParentById, canMove, canEdit, canDelete } from "@/helpers";
import { v4 as uuidv4 } from "uuid";
import { useIdle, useTimestamp, watchThrottled } from "@vueuse/core";

export const useDesktopStore = defineStore({
  id: "desktopStore",
  state: (): DesktopStore => ({
    // Filesystem
    fileSystem: defaultFileSystem(
      storeToRefs(useGlobalStore()).username.value.toLowerCase(),
    ),
    nodeMap: new Map<string, FileSystemNode>(),
    bookmarks: defaultBookmarks,

    // Docks
    isDockVisible: true,
    isDockPinned: true,

    // Apps
    hasAppsLoading: false,
    apps: defaultApps,

    // Desktop
    desktopRef: null,
  }),
  getters: {
    desktopNode(state): FileSystemNode | null {
      return findNodeByIdRecursive(state.fileSystem, "desktop");
    },

    trashNode(state): FileSystemNode | null {
      return findNodeByIdRecursive(state.fileSystem, "trash");
    },

    desktopItems(state): FileSystemNode[] {
      if (!this.desktopNode) return [];
      return this.desktopNode.children ? this.desktopNode.children : [];
    },

    trashItems(state): FileSystemNode[] {
      if (!this.trashNode) return [];
      return this.trashNode.children ? this.trashNode.children : [];
    },

    openApps(state): AppNode[] {
      return state.apps.filter((app) => app.isOpen && !app.isMinimized);
    },

    hasAppsAtTop(state): boolean {
      return this.openApps.some((app) => app.y <= 1);
    },

    bookmarksNodes(state): FileSystemNode[] {
      return state.bookmarks
        .map((id) => state.nodeMap.get(id))
        .filter((node): node is FileSystemNode => node !== undefined);
    },
  },
  actions: {
    /**
     * Initializes the nodeMap.
     */
    init(): void {
      this.initializeNodeMap(this.fileSystem);
      this.syncAppsWithLocalStorage();
      this.initIdleDetection();
    },

    /**
     * Recursively initializes the nodeMap with all nodes in the filesystem.
     * @param node The current FileSystemNode.
     */
    initializeNodeMap(node: FileSystemNode): void {
      this.nodeMap.set(node.id, node);
      if (node.children) {
        node.children.forEach((child) => this.initializeNodeMap(child));
      }
    },

    /**
     * Initializes idle detection and locks the desktop after inactivity
     */
    initIdleDetection(): void {
      if (import.meta.client) {
        const globalStore = useGlobalStore();
        const {
          isAuthenticated,
          isLocked,
          isAboutToSuspend,
          suspendedPercentage,
          dimScreenThreshold,
          isDimScreenEnabled,
        } = storeToRefs(globalStore);
        const { handleSuspend } = globalStore;

        const initialDimScreenThreshold = parseInt(dimScreenThreshold.value);

        const { idle, lastActive } = useIdle(initialDimScreenThreshold);
        const now = useTimestamp({ interval: 1000 });

        const idledFor = computed(() =>
          Math.floor((now.value - lastActive.value) / 1000),
        );

        // Gradually show the suspended overlay after 70% of the suspend duration
        watch(idledFor, (newValue: number) => {
          // If dim screen is disabled, do nothing
          if (!isDimScreenEnabled.value) return;

          const updatedDimScreenThreshold = parseInt(
            storeToRefs(globalStore).dimScreenThreshold.value,
          );

          const idleThreshold = Math.floor(
            (updatedDimScreenThreshold * 0.7) / 1000,
          ); // 70% of suspend duration in seconds
          const suspendPercentage =
            newValue < idleThreshold
              ? 0
              : Math.min(
                  (newValue - idleThreshold) /
                    ((updatedDimScreenThreshold * 0.3) / 1000),
                  1,
                ); // Scale 0-100% over remaining 30%
          isAboutToSuspend.value = newValue >= idleThreshold;
          suspendedPercentage.value = suspendPercentage;
        });

        watch(idle, (isIdle) => {
          if (!isAuthenticated.value) return;

          if (isIdle) {
            handleSuspend();
            isLocked.value = true;
          }
        });
      }
    },

    /**
     * Synchronizes the apps state with localStorage on the client-side.
     */
    syncAppsWithLocalStorage() {
      if (import.meta.client) {
        const storedApps = localStorage.getItem("apps");
        if (storedApps) {
          try {
            this.apps = JSON.parse(storedApps);
          } catch (e) {
            console.error("Failed to parse apps from localStorage:", e);
            this.apps = defaultApps;
          }
        } else {
          this.apps = defaultApps;
        }

        // Watch for changes and update localStorage accordingly
        watchThrottled(
          () => this.apps,
          (newApps) => {
            localStorage.setItem("apps", JSON.stringify(newApps));
          },
          { deep: true, throttle: 200 },
        );
      }
    },

    /**
     * Moves an item to a target folder.
     * @param itemId The ID of the item to move.
     * @param targetFolderId The ID of the target folder.
     * @returns True if successful, false otherwise.
     */
    moveItem(itemId: string, targetFolderId: string): boolean {
      const item = this.nodeMap.get(itemId);
      const targetFolder = this.nodeMap.get(targetFolderId);

      if (!item || !targetFolder || targetFolder.type === "file") return false;

      // Check permissions
      if (!canMove(item)) return false;

      // Prevent moving an item to itself
      if (itemId === targetFolderId) return false;

      const currentParent = findParentById(this.fileSystem, itemId);
      if (!currentParent || currentParent.type !== "folder") return false;

      // Remove from current parent
      currentParent.children = currentParent.children!.filter(
        (child) => child.id !== itemId,
      );

      // Add to target folder
      targetFolder.children = targetFolder.children || [];
      targetFolder.children.push(item);

      return true;
    },

    /**
     * Creates a new item within a parent folder.
     * @param parentId The ID of the parent folder.
     * @param newItem The new FileSystemNode to create (without an ID).
     * @returns The created FileSystemNode or null if failed.
     */
    createItem(
      parentId: string,
      newItem: Omit<FileSystemNode, "id">,
    ): FileSystemNode | null {
      const parent = this.nodeMap.get(parentId);
      if (!parent || parent.type !== "folder") return null;

      // Check permissions
      if (!canEdit(parent)) return null;

      const itemWithId: FileSystemNode = { ...newItem, id: uuidv4() };
      parent.children = parent.children || [];
      parent.children.push(itemWithId);
      this.nodeMap.set(itemWithId.id, itemWithId);
      return itemWithId;
    },

    /**
     * Edits an existing item's properties.
     * @param itemId The ID of the item to edit.
     * @param updatedData The properties to update.
     * @returns True if successful, false otherwise.
     */
    editItem(
      itemId: string,
      updatedData: Partial<Omit<FileSystemNode, "id">>,
    ): boolean {
      const item = this.nodeMap.get(itemId);
      if (!item) return false;

      // Check permissions
      if (!canEdit(item)) return false;

      // If the item is a file, check the extension if present, and update the icon
      if (item.type === "file") {
        const extension = item.name.split(".").pop();
        if (extension) {
          item.icon = getNodeIcon(extension);
        }
      }

      Object.assign(item, updatedData);
      return true;
    },

    /**
     * Deletes an item from the filesystem.
     * @param itemId The ID of the item to delete.
     * @returns True if successful, false otherwise.
     */
    deleteItem(itemId: string): boolean {
      const item = this.nodeMap.get(itemId);
      if (!item) return false;

      // Check permissions
      if (!canDelete(item)) return false;

      const parent = findParentById(this.fileSystem, itemId);
      if (!parent || !parent.children) return false;

      const index = parent.children.findIndex((child) => child.id === itemId);
      if (index === -1) return false;

      parent.children.splice(index, 1);
      this.nodeMap.delete(itemId);
      return true;
    },

    /**
     * Updates the desktopItems based on the new list from the UI.
     * This should handle reordering or moving items as needed.
     * @param newItems The updated list of FileSystemNodes.
     */
    // TODO: Implement this better
    updateDesktopItems(newItems: FileSystemNode[]) {
      // Clear the current children
      if (this.desktopNode) {
        this.desktopNode.children = [];

        // Re-populate based on newItems
        newItems.forEach((item) => {
          this.desktopNode!.children!.push(item);
          this.nodeMap.set(item.id, item);
        });
      }
    },

    /**
     * Updates the apps based on the new list from the UI.
     * @param newItems The updated list of AppNodes.
     */
    updateDockApps(newItems: AppNode[]) {
      // Filter out duplicates based on app id
      this.apps = newItems.filter(
        (app, index, self) => index === self.findIndex((t) => t.id === app.id),
      );
    },

    /**
     * Opens an app.
     * @param appId The ID of the app to open.
     */
    openApp(appId: string) {
      this.apps = this.apps.map((app) => ({
        ...app,
        isOpen: app.id === appId ? true : app.isOpen,
        isMinimized: app.id === appId ? false : app.isMinimized,
        isActive: app.id === appId ? true : app.isActive,
      }));
    },

    /**
     * Closes an app.
     * @param appId The ID of the app to close.
     */
    closeApp(appId: string) {
      this.apps = this.apps.map((app) => ({
        ...app,
        isOpen: app.id === appId ? false : app.isOpen,
        isActive: app.id === appId ? false : app.isActive,
        isMinimized: app.id === appId ? false : app.isMinimized,
        isFullscreen: app.id === appId ? false : app.isFullscreen,
        width: app.id === appId ? 0 : app.width,
        height: app.id === appId ? 0 : app.height,
        x: app.id === appId ? 0 : app.x,
        y: app.id === appId ? 0 : app.y,
      }));
    },

    /**
     * Minimizes an app.
     * @param appId The ID of the app to minimize.
     */
    toggleMinimizeApp(appId: string) {
      this.apps = this.apps.map((app) => ({
        ...app,
        isMinimized: app.id === appId ? !app.isMinimized : app.isMinimized,
      }));
    },

    /**
     * Update the app.
     * @param appId The ID of the app to update.
     * @param changes The changes to apply to the app.
     */
    updateApp(appId: string, changes: Partial<AppNode>) {
      this.apps = this.apps.map((app) =>
        app.id === appId ? { ...app, ...changes } : app,
      );
    },

    /**
     * Adds a node to bookmarks if not already present.
     * @param nodeId The ID of the node to add to bookmarks.
     */
    addToBookmarks(nodeId: string) {
      if (!this.bookmarks.includes(nodeId)) {
        this.bookmarks.push(nodeId);
      }
    },
  },
});

interface DesktopStore {
  // Filesystem
  fileSystem: FileSystemNode;
  nodeMap: Map<string, FileSystemNode>;
  bookmarks: string[]; // Array of ids

  // Docks
  isDockVisible: boolean;
  isDockPinned: boolean;

  // Apps
  hasAppsLoading: boolean;
  apps: AppNode[];

  // Desktop
  desktopRef: HTMLElement | null;
}
