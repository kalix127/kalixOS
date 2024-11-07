import type { FileSystemNode, AppNode } from "@/types";
import { useWindowSize } from "@vueuse/core";

export type TargetType = "desktop" | "file" | "folder" | "app" | "dock" | null;

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  targetType: TargetType;
  targetNode: FileSystemNode | AppNode | null;
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
     * @param targetType The type of the target ('desktop', 'file' ...).
     * @param targetNode The Node that was right-clicked, if any.
     */
    openContextMenu(
      x: number,
      y: number,
      targetType: TargetType,
      targetNode: FileSystemNode | AppNode | null = null,
    ) {
      const { width, height } = useWindowSize();
      const isOutside = x + 288 > width.value;

      let difference = 0;
      let updatedX = x;
      let updatedY = y;

      if (isOutside) {
        difference = width.value - (x + 288);
        updatedX += difference;
      }

      // Adjust the y position for the dock apps
      if (targetType === "dock") {
        // If the app is open, the context menu is 235px, else 182px (hardcoded)
        const contextMenuHeight = targetNode?.type === "social" ? 76 : 129;
        const currentBottomOffset = height.value - y;

        if (currentBottomOffset < contextMenuHeight) {
          updatedY -= contextMenuHeight;
        }
      }

      this.isOpen = true;
      this.x = updatedX;
      this.y = updatedY;
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
