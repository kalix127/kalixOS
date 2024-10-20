import { defineStore } from "pinia";
import { defaultFileSystem } from "@/constants";
import { useGlobalStore } from "@/stores/global.store";
import type { FileSystemNode } from "~/types";
import {
  findParentById,
  findNodeByAbsolutePath,
  canMove,
  canEdit,
  canDelete,
} from "@/helpers";
import { v4 as uuidv4 } from "uuid";
import { storeToRefs } from "pinia";

export const useDesktopStore = defineStore({
  id: "desktopStore",
  state: (): DesktopStore => ({
    fileSystem: defaultFileSystem(storeToRefs(useGlobalStore()).username.value),
    nodeMap: new Map<string, FileSystemNode>(),
    maxDesktopGridSlot: 0,
  }),
  getters: {
    desktopNode(state): FileSystemNode | null {
      const username = storeToRefs(useGlobalStore()).username.value;
      const path = `/home/${username}/Desktop`;
      return findNodeByAbsolutePath(state.fileSystem, path);
    },

    desktopItems(state): FileSystemNode[] {
      if (!this.desktopNode) return [];
      return this.desktopNode.children ? this.desktopNode.children : [];
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

      if (!item || !targetFolder || targetFolder.type !== "folder")
        return false;

      // Check permissions
      if (!canMove(item) || !canMove(targetFolder)) return false;

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
     * Reorders the desktop items based on the new order.
     * @param newOrder An array of FileSystemNode objects in the desired order.
     * @returns True if successful, false otherwise.
     */
    reorderDesktopItems(newOrder: FileSystemNode[]): boolean {
      const username = storeToRefs(useGlobalStore()).username.value;
      const path = `/home/${username}/Desktop`;
      const desktopNode = findNodeByAbsolutePath(this.fileSystem, path);
      if (!desktopNode || desktopNode.type !== "folder") return false;

      // Verify that newOrder contains the same items
      const currentIds = desktopNode.children?.map((child) => child.id).sort();
      const newIds = newOrder.map((child) => child.id).sort();
      if (JSON.stringify(currentIds) !== JSON.stringify(newIds)) {
        // The new order does not have the same items
        return false;
      }

      // Assign the new order
      desktopNode.children = newOrder;
      return true;
    },
  },
});

interface DesktopStore {
  fileSystem: FileSystemNode;
  nodeMap: Map<string, FileSystemNode>;
  maxDesktopGridSlot: number;
}
