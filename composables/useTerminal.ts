import { Terminal } from "@xterm/xterm";
import {
  handleCd,
  handleLs,
  handleChown,
  handleChmod,
} from "@/helpers/terminal";

export function useTerminal(terminalElement: HTMLElement) {
  const terminalStore = useTerminalStore();
  const {
    command,
    commandHistory,
    cursorPosition,
    currentDirectory,
    currentDirectoryNode,
    homeDirectoryNode,
  } = storeToRefs(terminalStore);
  const { setCurrentDirectory } = terminalStore;
  const username = storeToRefs(useGlobalStore()).username.value.toLowerCase();

  // Set the initial directories
  setCurrentDirectory(homeDirectoryNode.value!);

  // Init terminal
  const term = new Terminal({
    drawBoldTextInBrightColors: true,
    convertEol: true,
    cursorBlink: true,
    cursorStyle: "underline",
    cursorInactiveStyle: "underline",
    wordSeparator: " ",
    fontSize: 13,
    rightClickSelectsWord: false,
    tabStopWidth: 4,
    fontFamily: "JetBrainsMono Nerd Font Mono",
    theme: {
      brightCyan: "#299890",
      brightBlue: "#268bd2",
      brightWhite: "#d0cfcc",
      brightGreen: "#5fd601",
      background: "#161420",
    },
  });
  term.open(terminalElement);
  term.onKey((data) => onKey(data));

  // Default new line in the format -> <user>@<user>: <current-directory> $
  const newLine = computed(() => {
    const usernameAnsi = `\x1b[1;32m${username}@${username}\x1b[1;37m`;

    // If the current directory is the home directory, show '~/' instead of the full path
    if (currentDirectory.value === `/home/${username}`) {
      return `${usernameAnsi}:\x1b[1;34m ~ \x1b[1;37m$ `;
    }

    return `${usernameAnsi}:${currentDirectory.value} $ `;
  });

  term.write(newLine.value);

  function resetCommandAndCursor() {
    command.value = "";
    cursorPosition.value = 0;
  }

  function showNewLine() {
    term.write(`\r\n${newLine.value}`);
  }

  // TODO Handle text input logic
  function onKey(data: { key: string; domEvent: KeyboardEvent }) {
    const { key, domEvent } = data;

    switch (key) {
      // Enter
      case "\r":
        // If the command is not empty, handle it
        if (command.value.trim() !== "") {
          handleCommand();
        }

        showNewLine();
        resetCommandAndCursor();

        // TODO: Save it to the history if successful
        // commandHistory.value.push(command.value);
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

      // TODO: Ctrl+C
      case "\x03":
        term.write(`\r\n${newLine.value}`);
        resetCommandAndCursor();

        // TODO: Before exit, check if there are command / apps open.
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

      // TODO: Ctrl+R
      case "\x12":
        // Action: Show a list of previous commands used, numbered.
        // If the user has already typed something, filter the list based on the current input.
        // Implement a search or selection mechanism for the user to choose a previous command.
        break;

      // TODO: Tab Key
      case "\t":
        // Handle Autocomplete
        // if (command.value.trim() === "") return;
        break;

      // Any Other Key
      default:
        // Invalidate specific keys and combinations
        if (key === "\u001b[A") break; // Arrow up TODO: Switch to prev command
        if (key === "\u001b[B") break; // Arrow down TODO: Switch to next command if presents
        if (key === "\u001b[D") break; // Arrow left
        if (key === "\u001b[C") break; // Arrow right
        if (key === "\u001b[1;5A") break; // Ctrl + Arrow up
        if (key === "\u001b[1;5B") break; // Ctrl + Arrow down
        if (key === "\u001b[1;5D") break; // Ctrl + Arrow left
        if (key === "\u001b[1;5C") break; // Ctrl + Arrow right

        term.write(key);
        command.value += key;
        cursorPosition.value += key.length;
        break;
    }
  }

  /**
   * Main command handler that delegates to specific command functions.
   */
  function handleCommand() {
    const trimmedCommand = command.value.trim();
    const args = trimmedCommand.split(" ");
    const exec = args[0];
    const fileSystem = storeToRefs(useDesktopStore()).fileSystem.value;

    switch (exec) {
      case "cd":
        handleCd(
          term,
          args,
          fileSystem,
          currentDirectoryNode.value!,
          homeDirectoryNode.value!,
        );
        break;

      case "ls":
        handleLs(term, args, currentDirectoryNode.value!);
        break;

      case "chown":
        handleChown(term, args, fileSystem, currentDirectoryNode.value!);
        break;

      case "chmod":
        handleChmod(term, args, fileSystem, currentDirectoryNode.value!);
        break;

      case "pwd":
        term.write(`\r\n${currentDirectory.value}`);
        break;

      default:
        term.write(`\r\n${exec}: command not found`);
        break;
    }
  }

  return {
    term,
  };
}
