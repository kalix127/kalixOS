import type { Node, ContextMenuTargetType } from "@/types";
import { defineStore } from "pinia";
import { useWindowSize } from "@vueuse/core";

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  targetType: ContextMenuTargetType | null;
  targetNode: Node | null;
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
    openContextMenu(
      x: number,
      y: number,
      targetType: ContextMenuTargetType,
      targetNode: Node | null = null,
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
    closeContextMenu() {
      this.isOpen = false;
      this.x = 0;
      this.y = 0;
      this.targetType = null;
      this.targetNode = null;
    },
  },
});
