import { monacoEditorLanguageMap } from "@/constants";
import type { FileNode } from "~/types";


export const useKateStore = defineStore("kate", {
  state: (): KateStore => ({
    openedNode: null,
  }),
  getters: {
    editorLanguage(state): string {
      if (state.openedNode && state.openedNode.type === "file") {
        const fileName = state.openedNode.name;
        const extension = fileName.split(".").pop()?.toLowerCase() || "";
        return monacoEditorLanguageMap[extension] || "plaintext";
      }
      return "plaintext";
    },
  },
  actions: {
    setFileNode(node: FileNode) {
      this.openedNode = node;
    },
  },
});

interface KateStore {
  openedNode: FileNode | null;
}
