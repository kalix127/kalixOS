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
  getters: {},
  actions: {
    setCurrentDirectory(directoryNode: FileSystemNode) {
      const rootNode = storeToRefs(useDesktopStore()).fileSystem.value;
      const fullPath = getNodeFullPath(rootNode, directoryNode);
      this.currentDirectory = fullPath;
      this.currentDirectoryNode = directoryNode;
    },

    addCommandHistory(command: string) {
      // If the command is already in the history, re-insert it at the new index
      const existingIndex = this.commandHistory.findIndex(
        (cmd) => cmd === command,
      );
      if (existingIndex !== -1) {
        this.commandHistory.splice(existingIndex, 1);
      }

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
