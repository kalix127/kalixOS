import type { FolderNode } from "~/types";

export const useFilesStore = defineStore("files", {
  state: (): FilesState => ({
    openedNodeId: "home",
    history: ["home"],
    currentHistoryIndex: 0,
    isGridLayout: true,
    searchQuery: "",
    isSearching: false,
  }),
  getters: {
    openedNode(state) {
      if (!state.openedNodeId) return null;
      const { nodeMap } = storeToRefs(useDesktopStore());
      return nodeMap.value.get(state.openedNodeId) as FolderNode;
    },
    canMoveBack(state) {
      return state.currentHistoryIndex > 0;
    },
    canMoveForward(state) {
      return state.currentHistoryIndex < state.history.length - 1;
    },
  },
  actions: {
    setFilesNodeId(id: string) {
      if (id === this.openedNodeId) return;
      const index = this.history.indexOf(id);
      if (index !== -1) {
        this.history.splice(index, 1);
        if (index < this.currentHistoryIndex) {
          this.currentHistoryIndex--;
        }
      }
      this.history = this.history.slice(0, this.currentHistoryIndex + 1);
      if (!this.history.includes(id)) {
        this.history.push(id);
      }
      this.currentHistoryIndex = this.history.length - 1;
      this.openedNodeId = id;
    },
    moveBack() {
      if (this.currentHistoryIndex > 0) {
        this.currentHistoryIndex--;
        this.openedNodeId = this.history[this.currentHistoryIndex];
      }
    },
    moveForward() {
      if (this.currentHistoryIndex < this.history.length - 1) {
        this.currentHistoryIndex++;
        this.openedNodeId = this.history[this.currentHistoryIndex];
      }
    },
    toggleGridView() {
      this.isGridLayout = !this.isGridLayout;
    },
  },
});

interface FilesState {
  openedNodeId: string;
  history: string[];
  currentHistoryIndex: number;
  isGridLayout: boolean;
  searchQuery: string;
  isSearching: boolean;
}
