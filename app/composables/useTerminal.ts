import { WebLinksAddon } from "@xterm/addon-web-links";
import { Terminal } from "@xterm/xterm";
import { commandSpecs } from "@/constants";
import { helpMessages } from "@/constants/helpMessages";
import { findNodeByPath, resolvePath } from "@/helpers";
import {
  formatNodeName,
  handleCat,
  handleCd,
  handleChmod,
  handleChown,
  handleDf,
  handleFree,
  handleHelp,
  handleKill,
  handleLn,
  handleLs,
  handleMkdir,
  handleMv,
  handleNeofetch,
  handlePkill,
  handlePs,
  handleRm,
  handleTouch,
  handleTree,
  parseArguments,
} from "@/helpers/terminal";

export function useTerminal(terminalElement: HTMLElement) {
  const terminalStore = useTerminalStore();
  const {
    command,
    commandHistory,
    cursorPosition,
    currentDirectory,
    currentDirectoryNode,
    commandHistoryIndex,
  } = storeToRefs(terminalStore);
  const { setCurrentDirectory, addCommandHistory } = terminalStore;
  const username = storeToRefs(useGlobalStore()).username.value.toLowerCase();
  const { homeNode } = storeToRefs(useDesktopStore());

  // If not already set, Set the initial directories
  if (!currentDirectoryNode.value) {
    setCurrentDirectory(homeNode.value!);
  }

  // Set the user first time avoiding the terminal to start on the next Boot
  const { setUserDesktopFirstTime } = useGlobalStore();
  setUserDesktopFirstTime(false);

  // Init terminal and addons
  const webLinksAddon = new WebLinksAddon();
  const term = new Terminal({
    convertEol: true,
    cursorBlink: true,
    cursorStyle: "underline",
    cursorInactiveStyle: "underline",
    wordSeparator: " ",
    fontSize: 13,
    rightClickSelectsWord: false,
    tabStopWidth: 4,
    theme: {
      brightCyan: "#299890",
      brightBlue: "#268bd2",
      brightWhite: "#d0cfcc",
      green: "#859801",
      brightGreen: "#5fd601",
      background: "#161420",
    },
  });
  term.open(terminalElement);
  term.loadAddon(webLinksAddon);
  term.onKey(data => onKey(data));

  // Default new line in the format -> <user>@<user>: <current-directory> $
  const newLine = computed(() => {
    let textLine = `\x1B[1;32m${username}@${username}\x1B[1;37m`;
    textLine += ":";

    // If the current directory is the home directory, show '~/' instead of the full path
    if (currentDirectory.value === `/home/${username}`) {
      textLine += `\x1B[1;34m ~ \x1B[1;37m$ `;
    } else if (currentDirectory.value.startsWith(`/home/${username}/`)) {
      const relativePath = currentDirectory.value.substring(
        `/home/${username}/`.length,
      );
      textLine += ` \x1B[1;34m~/${relativePath}\x1B[1;37m $ `;
    } else {
      textLine += ` \x1B[1;34m${currentDirectory.value}\x1B[1;37m $ `;
    }

    return textLine;
  });

  // Show neofetch on startup
  handleNeofetch(term, username);
  term.write(newLine.value);

  // Update the current newline with a new path
  watch(currentDirectoryNode, () => deleteAndPrintNewLine());

  function resetCommandAndCursor() {
    command.value = "";
    cursorPosition.value = 0;
  }

  function showNewLine() {
    term.write(`\r\n${newLine.value}`);
  }

  function deleteAndPrintNewLine() {
    term.write("\r\x1B[K");
    term.write(`${newLine.value}`);
    term.write(command.value);
  }

  function onKey(data: { key: string; domEvent: KeyboardEvent }) {
    const { key, domEvent } = data;

    // Reset the command history index if the key is not the arrow up or down
    if (key !== "\u001B[A" && key !== "\u001B[B") {
      commandHistoryIndex.value = 0;
    }

    let shouldAddToHistory = false;

    switch (key) {
      // Enter
      case "\r":
        // If the command is not empty, handle it
        if (command.value.trim() !== "") {
          shouldAddToHistory = handleCommand();
        }

        showNewLine();
        if (!shouldAddToHistory)
          resetCommandAndCursor();
        break;

      // Backspace/Delete
      case "\x7F":
        if (cursorPosition.value > 0) {
          // If the cursor is at the end of the command
          if (cursorPosition.value === command.value.length) {
            command.value = command.value.slice(0, -1);
            cursorPosition.value -= 1;
            term.write("\b \b");
            break;
          }
        }
        break;

      case "\x03":
        term.write(`\r\n${newLine.value}`);
        resetCommandAndCursor();
        break;

      // Ctrl+L
      case "\f":
        term.clear();
        break;

      // Ctrl+V
      case "\x16":
        navigator.clipboard
          .readText()
          .then((clipText) => {
            // Update the terminal with the clipboard content
            term.write(clipText);

            // Update the command and cursor position
            command.value += clipText;
            cursorPosition.value += clipText.length;
          })
          .catch(() => {
            // Clipboard not supported or permission denied
            console.warn("Clipboard paste not supported.");
          });
        break;

      // Arrow Up
      case "\u001B[A":
        if (commandHistory.value.length > 0) {
          // If at start, begin from end of history
          if (commandHistoryIndex.value === 0) {
            commandHistoryIndex.value = commandHistory.value.length;
          }

          if (commandHistoryIndex.value > 0) {
            commandHistoryIndex.value--;
            command.value = commandHistory.value[commandHistoryIndex.value] || "";
            cursorPosition.value = command.value.length;

            deleteAndPrintNewLine();
          }
        }
        break;

      // Arrow Down
      case "\u001B[B":
        if (commandHistory.value.length > 0) {
          if (commandHistoryIndex.value < commandHistory.value.length - 1) {
            commandHistoryIndex.value++;
            command.value = commandHistory.value[commandHistoryIndex.value] || "";
            cursorPosition.value = command.value.length;

            term.write("\r\x1B[K"); // Clear current line
            term.write(`${newLine.value}`);
            term.write(command.value);
            // Clear command when reaching end of history
          } else if (
            commandHistoryIndex.value
            === commandHistory.value.length - 1
          ) {
            commandHistoryIndex.value++;
            command.value = "";
            cursorPosition.value = 0;

            term.write("\r\x1B[K");
            term.write(`${newLine.value}`);
          }
        }
        break;

      case "\t":
        // Handle Autocomplete
        handleAutocomplete();
        break;

      // Any Other Key
      default:
        // Invalidate specific keys and combinations
        if (key === "\u001B[D")
          break; // Arrow left
        if (key === "\u001B[C")
          break; // Arrow right
        if (key === "\u001B[1;5A")
          break; // Ctrl + Arrow up
        if (key === "\u001B[1;5B")
          break; // Ctrl + Arrow down
        if (key === "\u001B[1;5D")
          break; // Ctrl + Arrow left
        if (key === "\u001B[1;5C")
          break; // Ctrl + Arrow right
        if (domEvent.ctrlKey && domEvent.key === "Backspace")
          break; // Ctrl + Backspace

        term.write(key);
        command.value += key;
        cursorPosition.value += key.length;
        break;
    }

    if (shouldAddToHistory) {
      addCommandHistory(command.value);
      resetCommandAndCursor();
    }
  }

  /**
   * Main command handler that delegates to specific command functions.
   */
  function handleCommand(): boolean {
    const trimmedCommand = command.value.trim();
    const args = trimmedCommand.split(" ");
    const exec = args[0] || "";
    const fileSystem = storeToRefs(useDesktopStore()).fileSystem.value;

    let shouldAddToHistory = false;

    // Check if the file bin node for the command exists.
    if (!findNodeByPath(fileSystem, ["bin", exec])) {
      term.write(`\r\nzsh: command not found: ${exec}`);
      term.write("\r\nType 'help' to see available commands");
      return false;
    }

    const commandSpec = commandSpecs[exec];

    if (!commandSpec) {
      term.write(`\r\n${exec}: command specification not found`);
      return false;
    }

    let parsedArgs;
    try {
      parsedArgs = parseArguments(exec, args.slice(1), commandSpec);
    } catch (error: any) {
      term.write(`\r\n${error.message}`);
      return false;
    }

    // Handle help commands
    if (exec === "help") {
      shouldAddToHistory = handleHelp(term);
      return shouldAddToHistory;
    }

    if (
      (parsedArgs.flags.includes("-h") && exec !== "df" && exec !== "free")
      || parsedArgs.flags.includes("--help")
    ) {
      term.write(`\r\n${helpMessages[exec]}`);
      shouldAddToHistory = true;
      return shouldAddToHistory;
    }

    switch (exec) {
      case "cd":
        shouldAddToHistory = handleCd(
          term,
          parsedArgs,
          fileSystem,
          currentDirectoryNode.value!,
        );
        break;

      case "ls":
        shouldAddToHistory = handleLs(
          term,
          parsedArgs,
          fileSystem,
          currentDirectoryNode.value!,
        );
        break;

      case "ln":
        shouldAddToHistory = handleLn(
          term,
          parsedArgs,
          fileSystem,
          currentDirectoryNode.value!,
        );
        break;

      case "pwd":
        term.write(`\r\n${currentDirectory.value}`);
        shouldAddToHistory = true;
        break;

      case "tree":
        shouldAddToHistory = handleTree(
          term,
          args.slice(1),
          fileSystem,
          currentDirectoryNode.value!,
        );
        break;

      case "chown":
        shouldAddToHistory = handleChown(
          term,
          parsedArgs,
          fileSystem,
          currentDirectoryNode.value!,
        );
        break;

      case "chmod":
        shouldAddToHistory = handleChmod(
          term,
          parsedArgs,
          fileSystem,
          currentDirectoryNode.value!,
        );
        break;

      case "touch":
        shouldAddToHistory = handleTouch(
          term,
          parsedArgs,
          fileSystem,
          currentDirectoryNode.value!,
        );
        break;

      case "mkdir":
        shouldAddToHistory = handleMkdir(
          term,
          parsedArgs,
          fileSystem,
          currentDirectoryNode.value!,
        );
        break;

      case "mv":
        shouldAddToHistory = handleMv(
          term,
          parsedArgs,
          fileSystem,
          currentDirectoryNode.value!,
        );
        break;

      case "rm":
        shouldAddToHistory = handleRm(
          term,
          parsedArgs,
          fileSystem,
          currentDirectoryNode.value!,
        );
        break;

      case "cat":
        shouldAddToHistory = handleCat(
          term,
          parsedArgs,
          fileSystem,
          currentDirectoryNode.value!,
        );
        break;

      case "ps":
        shouldAddToHistory = handlePs(term, parsedArgs);
        break;

      case "kill":
        shouldAddToHistory = handleKill(term, parsedArgs);
        break;

      case "pkill":
        shouldAddToHistory = handlePkill(term, parsedArgs);
        break;

      case "free":
        shouldAddToHistory = handleFree(term, parsedArgs);
        break;

      case "df":
        shouldAddToHistory = handleDf(term, parsedArgs);
        break;

      case "whoami":
        term.write(`\r\n${username}`);
        shouldAddToHistory = true;
        break;

      case "neofetch":
        handleNeofetch(term, username);
        shouldAddToHistory = true;
        break;

      case "clear":
        term.clear();
        shouldAddToHistory = true;
        break;

      case "help":
        shouldAddToHistory = handleHelp(term);
        break;

      default:
        term.write(`\r\nzsh: command not found: ${exec}`);
        term.write("\r\nType 'help' to see available commands");
        break;
    }

    return shouldAddToHistory;
  }

  function handleAutocomplete(): void {
    const fileSystem = storeToRefs(useDesktopStore()).fileSystem.value;
    const trimmedCommand = command.value;
    const isTrailingSpace = trimmedCommand.endsWith(" ");
    const commandTokens = trimmedCommand.trim().split(/\s+/);
    const tokensLength = commandTokens.length;
    const lastToken = isTrailingSpace
      ? ""
      : commandTokens[commandTokens.length - 1] || "";

    if (tokensLength === 1 && !isTrailingSpace) {
      // autocomplete binaries
      const binNode = findNodeByPath(fileSystem, ["bin"]);
      if (binNode && binNode.type === "folder") {
        const commandNodes = binNode.children || [];
        const matchingCommands = commandNodes
          .filter(node => node.name?.startsWith(lastToken))
          .map(node => node.name);
        if (matchingCommands.length === 1) {
          // autocomplete the command
          const completion = matchingCommands[0]?.substring(lastToken.length) || "";
          command.value += completion;
          cursorPosition.value += completion.length;
          term.write(completion);
        } else if (matchingCommands.length > 1) {
          // show completions
          term.write("\r\n");
          const output = matchingCommands
            .map((cmd) => {
              const cmdNode = commandNodes.find(node => node.name === cmd);
              return cmdNode ? formatNodeName(cmdNode) : cmd;
            })
            .join("  ");
          term.write(output);
          // re-show the prompt and command
          term.write(`\r\n${newLine.value}${command.value}`);
        }
      }
    } else {
      // autocomplete file paths
      let pathToComplete = lastToken;
      if (!pathToComplete) {
        pathToComplete = "";
      }
      const { dir, incomplete } = splitPathAndIncomplete(pathToComplete);

      const targetDirNode = resolvePath(
        fileSystem,
        currentDirectoryNode.value!,
        dir || ".",
      );
      if (targetDirNode && targetDirNode.type === "folder") {
        const childNodes = targetDirNode.children || [];
        const matchingNodes = childNodes
          .filter(node => node.name.startsWith(incomplete))
          .map(node => node.name);

        if (matchingNodes.length === 1) {
          // autocomplete the path
          const completion = matchingNodes[0]?.substring(incomplete.length) || "";
          // append a '/' if the node is a folder
          const matchedNode = childNodes.find(
            node => node.name === matchingNodes[0],
          );
          if (matchedNode) {
            const isDir = matchedNode.type === "folder";
            const appendChar = isDir ? "/" : " ";

            command.value += completion + appendChar;
            cursorPosition.value += completion.length + appendChar.length;
            term.write(completion + appendChar);
          }
        } else if (matchingNodes.length > 1) {
          // show completions
          term.write("\r\n");
          const output = matchingNodes
            .map((name) => {
              const node = childNodes.find(n => n.name === name);
              return node ? formatNodeName(node) : name;
            })
            .join("  ");
          term.write(output);
          // re-show the prompt and command
          term.write(`\r\n${newLine.value}${command.value}`);
        }
      }
    }
  }

  function splitPathAndIncomplete(path: string): {
    dir: string;
    incomplete: string;
  } {
    const lastSlashIndex = path.lastIndexOf("/");
    if (lastSlashIndex === -1) {
      return {
        dir: "",
        incomplete: path,
      };
    } else {
      const dir = path.substring(0, lastSlashIndex + 1);
      const incomplete = path.substring(lastSlashIndex + 1);
      return {
        dir,
        incomplete,
      };
    }
  }

  return {
    term,
  };
}
