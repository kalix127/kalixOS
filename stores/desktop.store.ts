import {
  defaultFileSystem,
  defaultApps,
  defaultBookmarks,
  defaultBackgroundImage,
  defaultBackgroundImages,
} from "@/constants";
import { assignDefaultProperties, findNodeByIdRecursive } from "@/helpers";
import type {
  AppNode,
  Node,
  BackgroundImage,
  Process,
  FolderNode,
  ShortcutNode,
} from "~/types";
import { canMove, canEdit, canDelete, getNextPid } from "@/helpers";
import { useIdle, useIntervalFn, useTimestamp } from "@vueuse/core";

export const useDesktopStore = defineStore({
  id: "desktopStore",
  state: (): DesktopStore => ({
    // Filesystem
    fileSystem: defaultFileSystem(
      storeToRefs(useGlobalStore()).username.value.toLowerCase(),
    ),
    nodeMap: new Map<string, Node>(),
    bookmarks: defaultBookmarks,
    uptime: 0,
    processes: [],

    // Docks
    isDockVisible: true,
    isDockPinned: true,

    // Apps
    hasAppsLoading: false,
    apps: defaultApps,

    // Desktop
    desktopRef: null,
    backgroundImage: defaultBackgroundImage,
    backgroundImages: defaultBackgroundImages,
  }),
  getters: {
    homeNode(state): FolderNode | null {
      return findNodeByIdRecursive(state.fileSystem, "home") as FolderNode;
    },

    desktopNode(state): FolderNode | null {
      return findNodeByIdRecursive(state.fileSystem, "desktop") as FolderNode;
    },

    trashNode(state): FolderNode | null {
      return findNodeByIdRecursive(state.fileSystem, "trash") as FolderNode;
    },

    desktopItems(state): Node[] {
      if (!this.desktopNode) return [];
      return this.desktopNode.children ? this.desktopNode.children : [];
    },

    trashItems(state): Node[] {
      if (!this.trashNode) return [];
      return this.trashNode.children ? this.trashNode.children : [];
    },

    openApps(state): AppNode[] {
      return state.apps.filter((app) => app.isOpen && !app.isMinimized);
    },

    hasAppsAtTop(state): boolean {
      return this.openApps.some((app) => app.y <= 1);
    },

    hasAppFullscreen(state): boolean {
      return this.openApps.some((app) => app.isFullscreen);
    },

    bookmarksNodes(state): Node[] {
      return state.bookmarks
        .map((id) => state.nodeMap.get(id))
        .filter((node): node is Node => node !== undefined);
    },
  },
  actions: {
    /**
     * Initializes the nodeMap.
     */
    init(): void {
      this.initializeNodeMap(this.fileSystem as FolderNode);
      this.initIdleDetection();
      this.initUptime();
    },

    /**
     * Recursively initializes the nodeMap with all nodes in the filesystem.
     * @param node The current Node.
     */
    initializeNodeMap(node: Node): void {
      this.nodeMap.set(node.id, node);
      if (node.type === "folder") {
        (node as FolderNode).children.forEach((child) =>
          this.initializeNodeMap(child),
        );
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
        } = storeToRefs(globalStore);
        const { handleSuspend } = globalStore;

        const { lastActive } = useIdle(parseInt(dimScreenThreshold.value));

        const now = useTimestamp({ interval: 1000 });

        const idledFor = computed(() =>
          Math.floor((now.value - lastActive.value) / 1000),
        );

        watch(idledFor, (newValue: number) => {
          // If dim screen is disabled or set to 0, do nothing
          if (dimScreenThreshold.value === "0") return;

          const updatedDimScreenThreshold = parseInt(
            storeToRefs(globalStore).dimScreenThreshold.value,
          );
          const isDimScreenEnabled =
            storeToRefs(globalStore).isDimScreenEnabled;

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

          // if Dim screen is enabled, Gradually show the suspended overlay after 70% of the suspend duration
          if (isDimScreenEnabled.value) {
            suspendedPercentage.value = suspendPercentage;
          }

          // If the idleFor is grater than dimScreenThreshold, lock the screen
          if (newValue * 1000 >= parseInt(dimScreenThreshold.value)) {
            if (!isAuthenticated.value) return;

            handleSuspend();
            isLocked.value = true;
          }
        });
      }
    },

    /**
     * Initializes the uptime.
     */
    initUptime(): void {
      useIntervalFn(() => {
        this.uptime += 1;
      }, 1000);
    },

    moveItem(itemId: string, targetFolderId: string): boolean {
      const item = this.nodeMap.get(itemId);
      const targetFolder = this.nodeMap.get(targetFolderId);

      if (!item || !targetFolder || targetFolder.type !== "folder")
        return false;

      if (!canMove(item)) return false;

      if (itemId === targetFolderId) return false;

      if (item.type === "folder" && this.isDescendant(item, targetFolder)) {
        return false;
      }

      const currentParentId = item.parentId;
      if (!currentParentId) return false;
      const currentParent = this.nodeMap.get(currentParentId);
      if (!currentParent || currentParent.type !== "folder") return false;

      currentParent.children = currentParent.children.filter(
        (child) => child.id !== itemId,
      );

      targetFolder.children = targetFolder.children || [];
      targetFolder.children.push(item);

      item.parentId = targetFolder.id;

      return true;
    },

    isDescendant(node: Node, targetNode: Node): boolean {
      if (!targetNode.parentId) return false;
      if (targetNode.parentId === node.id) return true;
      const parentNode = this.nodeMap.get(targetNode.parentId);
      if (!parentNode) return false;
      return this.isDescendant(node, parentNode);
    },

    createItem(
      parentId: string,
      newItem: Partial<Omit<Node, "id" | "parentId" | "children">>,
    ): Node | null {
      const parent = this.nodeMap.get(parentId);
      if (!parent || parent.type !== "folder") return null;

      if (!canEdit(parent)) return null;

      const username = useGlobalStore().username;

      if (!newItem.type) return null;

      if (newItem.type === "shortcut") {
        if (!(newItem as ShortcutNode).targetId) {
          return null;
        }
        const targetNode = this.nodeMap.get((newItem as ShortcutNode).targetId);
        if (!targetNode) {
          return null;
        }
        if (targetNode.type === "shortcut") {
          return null;
        }
      }

      const newNode: Node = assignDefaultProperties(
        {
          ...newItem,
        } as Node,
        username,
        parent.id,
      );

      parent.children.push(newNode);
      this.nodeMap.set(newNode.id, newNode);

      return newNode;
    },

    editItem(
      itemId: string,
      updatedData: Partial<Omit<Node, "id" | "parentId" | "children">>,
    ): boolean {
      const item = this.nodeMap.get(itemId);
      if (!item) return false;

      if (!canEdit(item)) return false;

      if (updatedData.type && updatedData.type !== item.type) {
        return false;
      }

      if (item.type === "shortcut" && (updatedData as ShortcutNode).targetId) {
        const targetNode = this.nodeMap.get(
          (updatedData as ShortcutNode).targetId,
        );
        if (!targetNode || targetNode.type === "shortcut") {
          return false;
        }
        (item as ShortcutNode).targetId = (
          updatedData as ShortcutNode
        ).targetId;
      }

      Object.assign(item, updatedData);

      return true;
    },

    deleteItem(itemId: string): boolean {
      const item = this.nodeMap.get(itemId);
      if (!item) return false;

      if (!canDelete(item)) return false;

      const parentId = item.parentId;
      if (!parentId) return false;

      const parent = this.nodeMap.get(parentId);
      if (!parent || parent.type !== "folder") return false;

      const index = parent.children.findIndex((child) => child.id === itemId);
      if (index === -1) return false;

      parent.children.splice(index, 1);

      this.deleteNodeRecursively(item);

      this.removeShortcutsTo(itemId);

      return true;
    },

    deleteNodeRecursively(node: Node): void {
      if (node.type === "folder") {
        node.children.forEach((child) => {
          this.deleteNodeRecursively(child);
        });
      }
      this.nodeMap.delete(node.id);
    },

    removeShortcutsTo(targetId: string): void {
      const shortcutsToRemove: string[] = [];

      for (const [id, node] of this.nodeMap.entries()) {
        if (node.type === "shortcut" && node.targetId === targetId) {
          shortcutsToRemove.push(id);
        }
      }

      for (const shortcutId of shortcutsToRemove) {
        this.deleteItem(shortcutId);
      }
    },

    /**
     * Updates the desktopItems based on the new list from the UI.
     * This should handle reordering or moving items as needed.
     * @param newItems The updated list of Nodes.
     */
    // TODO: Implement this better
    updateDesktopItems(newItems: Node[]) {
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
    async openApp(appId: string) {
      const app = this.apps.find((app) => app.id === appId);
      if (!app) return;

      // If the node is not open, open it with delay
      if (!app.isOpen) {
        this.hasAppsLoading = true;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.apps = this.apps.map((app) => ({
          ...app,
          isOpen: app.id === appId ? true : app.isOpen,
          isMinimized: app.id === appId ? false : app.isMinimized,
          isActive: app.id === appId ? true : app.isActive,
        }));
        this.hasAppsLoading = false;

        // Create a process for the app
        this.createProcess(app.id, app.name.toLowerCase());
        return;
      } else {
        this.toggleMinimizeApp(appId);
      }
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

      // Close the process
      this.closeProcess(appId);
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

    /**
     * Sets the background image.
     * @param image The background image to set.
     */
    setBackgroundImage(image: BackgroundImage) {
      this.backgroundImage = image;

      // Check if the image is already in the backgroundImages array
      if (!this.backgroundImages.some((bg) => bg.url === image.url)) {
        this.backgroundImages.push(image);
      }
    },

    /**
     * Removes the background image.
     */
    deleteBackgroundImage(imageUrl: string) {
      this.backgroundImages = this.backgroundImages.filter(
        (bg) => bg.url !== imageUrl,
      );

      // If the deleted image is the current background image or If there is only one background image left (the default one), set the default background image
      if (
        this.backgroundImage.url === imageUrl ||
        this.backgroundImages.length === 1
      ) {
        this.backgroundImage = defaultBackgroundImage;
      }
    },

    /**
     * Create a process.
     * @param process The process to add.
     */
    createProcess(appId: string, command: string) {
      // Check if the process for that appId is already running
      if (this.processes.some((process) => process.appId === appId)) return;

      this.processes.push({
        pid: getNextPid(this.processes),
        appId: appId,
        startTimeTimestamp: useTimestamp({ offset: 0 }).value,
        command,
      });
    },

    /**
     * Closes a process.
     * @param appId The appId of the process.
     */
    closeProcess(appId: string) {
      this.processes = this.processes.filter(
        (process) => process.appId !== appId,
      );
    },
  },
});

interface DesktopStore {
  // Filesystem
  fileSystem: FolderNode;
  nodeMap: Map<string, Node>;
  bookmarks: string[]; // Array of ids
  uptime: number;
  processes: Process[];

  // Docks
  isDockVisible: boolean;
  isDockPinned: boolean;

  // Apps
  hasAppsLoading: boolean;
  apps: AppNode[];

  // Desktop
  desktopRef: HTMLElement | null;
  backgroundImage: BackgroundImage;
  backgroundImages: BackgroundImage[];
}
