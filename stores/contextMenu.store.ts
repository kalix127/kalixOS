import { defineStore } from "pinia";
import type { FileSystemNode } from "@/types";
import { useWindowSize } from "@vueuse/core";

export type TargetType = "desktop" | "file" | "folder" | "app" | null;

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  targetType: TargetType;
  targetNode: FileSystemNode | null;
}

export const useContextMenuStore = defineStore("contextMenu", {
  state: (): ContextMenuState => ({
    isOpen: false,
    x: 0,
    y: 0,
    targetType: null,
    targetNode: null,
  }),
  actions: {
    /**
     * Opens the context menu at the specified position with the given target.
     * @param x The x-coordinate for the context menu.
     * @param y The y-coordinate for the context menu.
     * @param targetType The type of the target ('desktop', 'file', 'folder', 'app').
     * @param targetNode The FileSystemNode that was right-clicked, if any.
     */
    openContextMenu(
      x: number,
      y: number,
      targetType: TargetType,
      targetNode: FileSystemNode | null = null,
    ) {
      const { width } = useWindowSize();
      const isOutside = x + 288 > width.value;

      let difference = 0;
      let updatedX = x;
      if (isOutside) {
        difference = width.value - (x + 288);
        updatedX = x + difference;
      }

      this.isOpen = true;
      this.x = updatedX;
      this.y = y;
      this.targetType = targetType;
      this.targetNode = targetNode;
    },
    /**
     * Closes the context menu.
     */
    closeContextMenu() {
      this.isOpen = false;
      this.x = 0;
      this.y = 0;
      this.targetType = null;
      this.targetNode = null;
    },
  },
});
