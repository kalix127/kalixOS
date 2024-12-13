export const helpMessages: { [commandName: string]: string } = {
  help: `Available Commands:

  cd        change the working directory.
  ls        list information about the FILEs (the current directory by default)
  ln        create links between files.
  pwd       print the absolute path of the current working directory.
  tree      display a tree of the directory structure.
  chown     change the owner and/or group of each FILE to OWNER and/or GROUP.
  chmod     change the mode of each FILE to MODE.
  touch     create a file if it does not exist.
  mkdir     create the DIRECTORY, if it does not already exist.
  mv        move (rename) files.
  rm        remove (unlink) the FILE.
  cat       print the contents of FILE to standard output.
  ps        report a snapshot of the current processes.
  kill      close a running application by PID.
  pkill     close a running application by name.
  free      display the amount of free and used memory in the system.
  df        show disk space usage.
  whoami    print the current user name.
  clear     clear the terminal screen.
  neofetch  display system and project information.

Use 'command --help or -h' for more information on a specific command.`,

  cd: `Usage: cd [DIRECTORY]...
Change the working directory.

Options:
  -h, --help        display this help and exit.`,

  ls: `Usage: ls [OPTIONS]... [PATH]...
List information about the FILEs (the current directory by default)

Options:
  -l, --list           use a long listing format.
  -a, --all            do not ignore entries starting with .
  -h, --help           display this help and exit.`,

  ln: `Usage: ln [OPTIONS]... TARGET LINK_NAME
Create links between files.

Options:
  -s, --symbolic      make symbolic links instead of hard links
  -h, --help          display this help and exit.`,

  pwd: `Usage: pwd
Print the absolute path of the current working directory.

Options:
  -h, --help        display this help and exit.`,

  tree: `Usage: tree [OPTIONS]... [PATH]...
Display a tree of the directory structure.

Options:
  -L, --level <num>    max display depth of the directory tree.
  -h, --help           display this help and exit.`,

  chown: `Usage: chown [OWNER:GROUP] FILE...
Change the owner and/or group of each FILE to OWNER and/or GROUP.

Options:
  -h, --help        display this help and exit.`,

  chmod: `Usage: chmod [MODE]... FILE...
Change the mode of each FILE to MODE.

Options:
  -h, --help        display this help and exit.`,

  touch: `Usage: touch FILE...
Create a file if it does not exist.

Options:
  -h, --help        display this help and exit.`,

  mkdir: `Usage: mkdir [OPTIONS]... DIRECTORY...
Create the DIRECTORY, if it does not already exist.

Options:
  -h, --help        display this help and exit.`,

  mv: `Usage: mv SOURCE... DESTINATION...
Move SOURCE to DIRECTORY.

Options:
  -h, --help        display this help and exit.`,

  rm: `Usage: rm [OPTIONS]... FILE...
Remove (unlink) the FILE.

Options:
  -r, --recursive     remove directories and their contents recursively.
  -h, --help          display this help and exit.`,

  cat: `Usage: cat FILE...
Print the contents of FILE to standard output.

Options:
  -h, --help        display this help and exit.`,

  ps: `Usage: ps
Report a snapshot of the current processes.

Options:
  -h, --help        display this help and exit.`,

  kill: `Usage: kill <pid>
Close a running application by PID.

Options:
  -h, --help        display this help and exit.`,

  pkill: `Usage: pkill -f <pattern>
Close a running application by name.

Options:
  -f, --full          match against full argument lists.
  -h, --help          display this help and exit.`,

  free: `Usage: free [OPTIONS]...
Display the amount of free and used memory in the system.

Options:
  -h, --human          human-readable output.
      --help           display this help and exit.`,

  df: `Usage: df [OPTIONS]...
Show disk space usage.

Options:
  -h, --human          human-readable output.
      --help           display this help and exit.`,

  whoami: `Usage: whoami
Print the current user name.

Options:
  -h, --help        display this help and exit.`,

  clear: `Usage: clear
Clear the terminal screen.

Options:
  -h, --help        display this help and exit.`,

  neofetch: `Usage: neofetch
Display system and project information.

Options:
  -h, --help        display this help and exit.`,
};
