import { findNodeByIdRecursive, getNodeFullPath } from "@/helpers";
import type { FileSystemNode } from "@/types";

const username = storeToRefs(useGlobalStore()).username.value.toLowerCase();

export const useTerminalStore = defineStore("terminal", {
  state: (): TerminalState => ({
    command: "",
    commandHistory: [],
    cursorPosition: 0,

    currentDirectory: `/home/${username}/`,
    currentDirectoryNode: null,
  }),
  getters: {
    homeDirectoryNode(state): FileSystemNode | null {
      const fileSystem = storeToRefs(useDesktopStore()).fileSystem.value;
      return findNodeByIdRecursive(fileSystem, "home");
    },
  },
  actions: {
    setCurrentDirectory(directoryNode: FileSystemNode) {
      const rootNode = storeToRefs(useDesktopStore()).fileSystem.value;
      const fullPath = getNodeFullPath(rootNode, directoryNode);
      this.currentDirectory = fullPath;
      this.currentDirectoryNode = directoryNode;
    },
  },
});

interface TerminalState {
  command: string;
  commandHistory: string[];
  cursorPosition: number;

  currentDirectoryNode: FileSystemNode | null;
  currentDirectory: string;
}
