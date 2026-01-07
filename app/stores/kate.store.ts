import type { FileNode } from "@/types";
import { monacoEditorLanguageMap } from "@/constants";

export const useKateStore = defineStore("kate", {
  state: (): KateStore => ({
    openedNodeId: null,
  }),
  getters: {
    openedNode(state): FileNode | null {
      if (!state.openedNodeId)
        return null;
      const { nodeMap } = storeToRefs(useDesktopStore());
      const node = nodeMap.value.get(state.openedNodeId);
      return node && node.type === "file" ? node : null;
    },
    editorLanguage(): string {
      if (this.openedNode && this.openedNode.type === "file") {
        const fileName = this.openedNode.name;
        const extension = fileName.split(".").pop()?.toLowerCase() || "";
        return monacoEditorLanguageMap[extension] || "plaintext";
      }
      return "plaintext";
    },
  },
  actions: {
    setKateNodeId(id: string) {
      this.openedNodeId = id;
    },
  },
});

interface KateStore {
  openedNodeId: string | null;
}
