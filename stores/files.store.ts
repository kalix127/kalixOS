import type { FolderNode } from "~/types";

export const useFilesStore = defineStore("files", {
  state: (): FilesState => ({
    openedNodeId: "home",
    isGridView: false,
    searchQuery: "",
    isSearching: false,
  }),
  getters: {
    openedNode(state) {
      if (!state.openedNodeId) return null;
      const { nodeMap } = storeToRefs(useDesktopStore());
      return nodeMap.value.get(state.openedNodeId) as FolderNode;
    },
  },
  actions: {
    setFilesNodeId(id: string) {
      this.openedNodeId = id;
    },
  },
});

interface FilesState {
  openedNodeId: string;
  isGridView: boolean;
  searchQuery: string;
  isSearching: boolean;
}
