import { defineStore } from "pinia";
import { defaultFileSystem, defaultApps } from "@/constants";
import { getNodeIcon } from "@/helpers";
import type { AppNode, FileSystemNode } from "~/types";
import {
  findParentById,
  findNodeByAbsolutePath,
  canMove,
  canEdit,
  canDelete,
} from "@/helpers";
import { v4 as uuidv4 } from "uuid";

export const useDesktopStore = defineStore({
  id: "desktopStore",
  state: (): DesktopStore => ({
    // Filesystem
    fileSystem: defaultFileSystem(storeToRefs(useGlobalStore()).username.value),
    nodeMap: new Map<string, FileSystemNode>(),

    // Docks
    isDockVisible: false,

    // Apps
    hasAppsLoading: false,
    apps: defaultApps,
    activeApp: null,

    // Desktop
    desktopRef: null,
  }),
  getters: {
    desktopNode(state): FileSystemNode | null {
      const username = storeToRefs(useGlobalStore()).username.value;
      const path = `/home/${username}/Desktop`;
      return findNodeByAbsolutePath(state.fileSystem, path);
    },

    trashNode(state): FileSystemNode | null {
      const username = storeToRefs(useGlobalStore()).username.value;
      const path = `/home/${username}/Desktop/Trash`;
      return findNodeByAbsolutePath(state.fileSystem, path);
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

  },
  actions: {
    /**
     * Initializes the nodeMap.
     */
    init(): void {
      this.initializeNodeMap(this.fileSystem);
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
    minimizeApp(appId: string) {
      this.apps = this.apps.map((app) => ({
        ...app,
        isMinimized: app.id === appId ? true : app.isMinimized,
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
  },
});

interface DesktopStore {
  // Filesystem
  fileSystem: FileSystemNode;
  nodeMap: Map<string, FileSystemNode>;

  // Docks
  isDockVisible: boolean;

  // Apps
  hasAppsLoading: boolean;
  apps: AppNode[];
  activeApp: AppNode | null;

  // Desktop
  desktopRef: HTMLElement | null;
}
