import { monacoEditorLanguageMap } from "@/constants";
import type { FileNode } from "~/types";


export const useTextEditorStore = defineStore("textEditor", {
  state: (): TextEditorState => ({
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
    setNode(node: FileNode) {
      this.openedNode = node;
    },
  },
});

interface TextEditorState {
  openedNode: FileNode | null;
}
