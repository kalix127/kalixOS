import { monacoEditorLanguageMap } from "@/constants";
import type { FileNode } from "@/types";

export const useKateStore = defineStore("kate", {
  state: (): KateStore => ({
    openedNodeId: null,
  }),
  getters: {
    openedNode(state) {
      if (!state.openedNodeId) return null;
      const { nodeMap } = storeToRefs(useDesktopStore());
      return nodeMap.value.get(state.openedNodeId) as FileNode;
    },
    editorLanguage(state): string {
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
