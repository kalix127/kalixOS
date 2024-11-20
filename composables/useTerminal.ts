import { Terminal } from "@xterm/xterm";

export function useTerminal(terminalElement: HTMLElement) {
  const { command, commandHistory, cursorPosition, currentDirectory } =
    storeToRefs(useTerminalStore());
  const username = storeToRefs(useGlobalStore()).username.value.toLowerCase();

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
      brightBlue: "#268BD2",
    },
  });
  term.open(terminalElement);
  term.onKey((data) => onKey(data));

  // Default new line in the format -> <user>@<user>: <current-directory> $ 
  const newLine = computed(() => {
    const usernameAnsi = `\x1b[1;32m${username}@${username}\x1b[1;37m`;

    // If the current directory is the home directory, show '~/' instead of the full path
    if (currentDirectory.value === `/home/${username}/`) {
      return `${usernameAnsi}:\x1b[1;34m ~ \x1b[1;37m$ `;
    }

    return `${usernameAnsi}:${currentDirectory.value.slice(0, -1)} $ `;
  });

  term.write(newLine.value);

  function resetCommandAndCursor() {
    command.value = "";
    cursorPosition.value = 0;
  }

  // TODO Handle text input logic
  function onKey(data: { key: string; domEvent: KeyboardEvent }) {
    const { key, domEvent } = data;

    switch (key) {
      // Enter
      case "\r":
        term.write(`\r\n${newLine.value}`);
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

      // Ctrl+C
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
        if (key === "\u001b[A") break; // Arrow up
        if (key === "\u001b[B") break; // Arrow down
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

  return {
    term,
  };
}
