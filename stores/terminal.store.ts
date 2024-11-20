import {
  findNodeByIdRecursive,
} from "@/helpers";
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
    setCurrentDirectory(directory: string) {
      this.currentDirectory = directory;
      this.currentDirectoryNode = this.homeDirectoryNode;
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
