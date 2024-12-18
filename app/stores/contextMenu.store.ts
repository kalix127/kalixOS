import type { ContextMenuTargetType, Node } from "@/types";
import { useWindowSize } from "@vueuse/core";

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  targetType: ContextMenuTargetType | null;
  targetNode: Node | null;
  isForDesktop: boolean | null; // Indicate if the context menu should be t
}

export const useContextMenuStore = defineStore("contextMenu", {
  state: (): ContextMenuState => ({
    isOpen: false,
    x: 0,
    y: 0,
    targetType: null,
    targetNode: null,
    isForDesktop: null,
  }),
  actions: {
    openContextMenu(
      x: number,
      y: number,
      targetType: ContextMenuTargetType,
      targetNode: Node | null = null,
      isForDesktop: boolean,
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

      if (targetType === "dock") {
        const contextMenuHeight = 76;
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
      this.isForDesktop = isForDesktop;
    },
    closeContextMenu() {
      this.isOpen = false;
      this.x = 0;
      this.y = 0;
      this.targetType = null;
      this.targetNode = null;
      this.isForDesktop = null;

      // If the menu was opened on a node within the files app
      if (!this.isForDesktop) {
        const { updateApp } = useDesktopStore();
        updateApp("files", { isDropdownOpen: false });
      }
    },
  },
});
