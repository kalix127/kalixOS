import { findNodeByIdRecursive, getNodeFullPath } from "@/helpers";
import type { FileSystemNode } from "@/types";

const username = storeToRefs(useGlobalStore()).username.value.toLowerCase();

export const useTerminalStore = defineStore("terminal", {
  state: (): TerminalState => ({
    command: "",
    cursorPosition: 0,
    commandHistory: [],
    commandHistoryIndex: 0,

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

    addCommandHistory(command: string) {
      // Check if exact command is already in history
      if (this.commandHistory.some((cmd) => cmd === command)) return;

      this.commandHistory.push(command);
    },
  },
});

interface TerminalState {
  command: string;
  cursorPosition: number;
  commandHistory: string[];
  commandHistoryIndex: number;

  currentDirectoryNode: FileSystemNode | null;
  currentDirectory: string;
}
