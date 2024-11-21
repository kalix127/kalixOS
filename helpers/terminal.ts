import { Terminal } from "@xterm/xterm";
import type { FileSystemNode } from "~/types";
import {
  findNodeByAbsolutePath,
  findParentById,
  splitPath,
  findNodeByPath,
  resolvePath,
} from "~/helpers";
import { useWindowSize } from "@vueuse/core";

const { editItem } = useDesktopStore();
const { setCurrentDirectory } = useTerminalStore();

export function handleCd(
  term: Terminal,
  args: string[],
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
  homeDirectoryNode: FileSystemNode,
): boolean {
  const toDir = args[1];
  if (!toDir) {
    setCurrentDirectory(homeDirectoryNode);
    return true;
  }

  let targetNode: FileSystemNode | null = null;

  if (toDir.startsWith("/")) {
    // Absolute path
    targetNode = findNodeByAbsolutePath(fileSystem, toDir);
  } else if (toDir === "..") {
    // Parent directory
    targetNode = findParentById(fileSystem, currentDirectoryNode.id);
  } else {
    // Relative path
    targetNode = findNodeByPath(currentDirectoryNode, splitPath(toDir));
  }

  if (!targetNode) {
    term.write(`\r\ncd: ${toDir}: No such file or directory`);
    return false;
  }

  setCurrentDirectory(targetNode);
  return true;
}

export function handleLs(
  term: Terminal,
  args: string[],
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
): boolean {
  const flags = args.filter((arg) => arg.startsWith("-"));
  const pathArgs = args.filter((arg) => !arg.startsWith("-"));
  const path = pathArgs.length > 0 ? pathArgs[0] : null;

  let targetNode: FileSystemNode | null = null;

  if (path) {
    // Resolve the provided path (absolute or relative)
    targetNode = resolvePath(fileSystem, currentDirectoryNode, path);
    if (!targetNode) {
      term.write(`\r\nls: cannot access '${path}': No such file or directory`);
      return false;
    }
  } else {
    // Default to current directory
    targetNode = currentDirectoryNode;
  }

  const nodes = targetNode.children ?? [];

  if (flags.includes("-l")) {
    // Calculate maximum column widths dynamically
    const maxOwnerLength = Math.max(
      ...nodes.map((node) => (node.owner ?? "unknown").length),
      5, // Minimum length for "Owner"
    );
    const maxGroupLength = Math.max(
      ...nodes.map((node) => (node.group ?? "unknown").length),
      5, // Minimum length for "Group"
    );
    const maxSizeLength = Math.max(
      ...nodes.map((node) => {
        const size =
          node.type === "file" ? `${node.content?.length ?? 0}` : "4096";
        return size.length;
      }),
      4, // Minimum length for "Size"
    );

    nodes.forEach((node) => {
      const type = node.type === "folder" ? "d" : "-";

      // Ensure permissions are defined
      if (!node.permissions) {
        term.write(
          `\r\nls: cannot read permissions of '${node.name}': Permissions undefined`,
        );
        return;
      }

      const permissions = formatPermissions(node.permissions);
      const size =
        node.type === "file" ? `${node.content?.length ?? 0}` : "4096";
      const date = node.createdAt ?? "";
      const owner = node.owner ?? "unknown";
      const group = node.group ?? "unknown";
      const nodeName = formatNodeName(node);

      term.write(
        `\r\n${type}${permissions} ${owner.padEnd(maxOwnerLength)} ${group.padEnd(maxGroupLength)} ${size.padStart(maxSizeLength)} ${date} ${nodeName}`,
      );
    });
    return false;
  }

  // If a path is provided without '-l', show the contents of the path
  if (path) {
    const output = nodes.map((node) => formatNodeName(node)).join("  ");

    if (output.trim() !== "") {
      term.write(`\r\n${output}`);
    }
    return false;
  }

  // If no flags or paths are provided, show simple list format
  const output = nodes.map((node) => formatNodeName(node)).join("  ");
  if (output) {
    term.write(`\r\n${output}`);
  }
  return false;
}

export function formatNodeName(node: FileSystemNode): string {
  return node.type === "folder" ? `\x1b[1;34m${node.name}\x1b[0m` : node.name;
}

export function handleChown(
  term: Terminal,
  args: string[],
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
): boolean {
  if (!args[0]) {
    term.write(`\r\nchown: missing operand`);
    return false;
  }

  const [user, group] = args[0].split(":");
  if (!user || !group) {
    term.write(`\r\nchown: invalid format; expected 'user:group'`);
    return false;
  }

  const targetPath = args[1];
  if (!targetPath) {
    term.write(`\r\nchown: missing file operand`);
    return false;
  }

  const targetNode = resolvePath(fileSystem, currentDirectoryNode, targetPath);
  if (!targetNode) {
    term.write(
      `\r\nchown: cannot access '${targetPath}': No such file or directory`,
    );
    return false;
  }

  editItem(targetNode.id, { owner: user, group });
  return true;
}

export function handleChmod(
  term: Terminal,
  args: string[],
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
): boolean {
  if (!args[1]) {
    term.write("\r\nchmod: missing operand");
    return false;
  }

  const mode = args[1];
  const targetPath = args[2];
  if (!targetPath) {
    term.write("\r\nchmod: missing file operand");
    return false;
  }

  const targetNode = resolvePath(fileSystem, currentDirectoryNode, targetPath);
  if (!targetNode) {
    term.write(
      `\r\nchmod: cannot access '${targetPath}': No such file or directory`,
    );
    return false;
  }

  const permissions = targetNode.permissions;

  // Symbolic mode (e.g., u+x, g-w)
  if (/^[ugoa]*[+-=][rwx]+$/.test(mode)) {
    const targets = [] as Array<"owner" | "group" | "others">;

    if (!/[ugo]/.test(mode[0]) || mode.startsWith("a")) {
      targets.push("owner", "group", "others");
    } else {
      if (mode.includes("u")) targets.push("owner");
      if (mode.includes("g")) targets.push("group");
      if (mode.includes("o")) targets.push("others");
    }

    const operation = mode.match(/[+-=]/)?.[0];
    const permissionTypes = mode.match(/[rwx]+/)?.[0].split("") ?? [];

    targets.forEach((target) => {
      permissionTypes.forEach((perm) => {
        const permKey = (
          perm === "r" ? "read" : perm === "w" ? "write" : "execute"
        ) as keyof (typeof permissions)[typeof target];
        switch (operation) {
          case "+":
            permissions[target][permKey] = true;
            break;
          case "-":
            permissions[target][permKey] = false;
            break;
          case "=":
            // Reset all permissions for the target
            permissions[target] = { read: false, write: false, execute: false };
            permissions[target][permKey] = true;
            break;
          default:
            break;
        }
      });
    });

    editItem(targetNode.id, { permissions });
    return true;
  } else if (/^[0-7]{3}$/.test(mode)) {
    // Numeric mode (e.g., 777)
    const values = mode.split("").map((char) => parseInt(char, 8));
    const newPermissions: FileSystemNode["permissions"] = {
      owner: {
        read: !!(values[0] & 4),
        write: !!(values[0] & 2),
        execute: !!(values[0] & 1),
      },
      group: {
        read: !!(values[1] & 4),
        write: !!(values[1] & 2),
        execute: !!(values[1] & 1),
      },
      others: {
        read: !!(values[2] & 4),
        write: !!(values[2] & 2),
        execute: !!(values[2] & 1),
      },
    };

    editItem(targetNode.id, { permissions: newPermissions });
    return true;
  } else {
    term.write(`\r\nchmod: invalid mode: '${mode}'`);
    return false;
  }
}

export function handleNeofetch(term: Terminal, username: string): void {
  // Get uptime
  const { uptime } = storeToRefs(useDesktopStore());
  const readableUptime = formatUptime(uptime.value);

  // Get resolution
  const { width, height } = useWindowSize();
  const resolution = `${width.value}x${height.value}`;

  // Get memory
  const { memoryUsedPercentage } = storeToRefs(useGlobalStore());
  const memoryUsed = Math.round((memoryUsedPercentage.value / 100) * 15406);

  // Links
  const authorLink = generateLink(
    "https://github.com/GianlucaIavicoli",
    "@GianlucaIavicoli",
  );
  const themeLink = generateLink(
    "https://github.com/lassekongo83/adw-gtk3",
    "adw-gtk3 [GTK2/3]",
  );
  const iconLink = generateLink(
    "https://github.com/PapirusDevelopmentTeam/papirus-icon-theme",
    "Papirus-Dark [GTK2/3]",
  );

  const neoFetch = `
  \x1b[1;36m                    -'                    ${username}\x1b[1;37m@\x1b[1;36m${username}
  \x1b[1;36m                   .o+'                   \x1b[1;37m-------------------
  \x1b[1;36m                  'ooo/                   Author:\x1b[1;37m ${authorLink}
  \x1b[1;36m                 '+oooo:                  OS:\x1b[1;37m Manjaro Linux x86_64 
  \x1b[1;36m                '+oooooo:                 Host:\x1b[1;37m ThinkPad X1 Carbon Gen 9
  \x1b[1;36m                -+oooooo+:                Kernel:\x1b[1;37m 6.10.13-3-MANJARO
  \x1b[1;36m              '/:-:++oooo+:               Uptime:\x1b[1;37m ${readableUptime}
  \x1b[1;36m             '/++++/+++++++:              Packages:\x1b[1;37m 782 (pacman)
  \x1b[1;36m            '/++++++++++++++:             Shell:\x1b[1;37m zsh
  \x1b[1;36m           '/+++ooooooooooooo/'           Resolution:\x1b[1;37m ${resolution} 
  \x1b[1;36m          ./ooosssso++osssssso+'          DE:\x1b[1;37m GNOME
  \x1b[1;36m         .oossssso-''''/ossssss+'         VM:\x1b[1;37m Mutter
  \x1b[1;36m        -osssssso.      :ssssssso.        Theme:\x1b[1;37m ${themeLink}
  \x1b[1;36m       :osssssss/        osssso+++.       Icons:\x1b[1;37m ${iconLink}
  \x1b[1;36m      /ossssssss/        +ssssooo/-       Terminal:\x1b[1;37m gnome-terminal
  \x1b[1;36m    '/ossssso+/:-        -:/+osssso+-     CPU:\x1b[1;37m Intel Core i7-1165G7 @ 4.70GHz (8) 
  \x1b[1;36m   '+sso+:-'                 '.-/+oso:    GPU:\x1b[1;37m NVIDIA GeForce RTX 4060 Mobile
  \x1b[1;36m  '++:.                           '-/+/   GPU:\x1b[1;37m Intel Iris Xe Graphics
  \x1b[1;36m  .'                                 '/   Memory:\x1b[1;37m ${memoryUsed}MiB / 15406MiB

`;
  term.clear();
  term.write(`${neoFetch}`);
}

export function generateLink(url: string, label: string): string {
  return `\x1b]8;;${url}\x07${label}\x1b]8;;\x07`;
}

export function formatUptime(uptime: number): string {
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  return `${hours} hours, ${minutes} mins`;
}

/**
 * Converts the permissions object to a string like rwxr-xr-x.
 * @param permissions The permissions object.
 * @returns The formatted permissions string.
 */
function formatPermissions(permissions: FileSystemNode["permissions"]): string {
  const permissionString = (perm: {
    read: boolean;
    write: boolean;
    execute: boolean;
  }) =>
    `${perm.read ? "r" : "-"}${perm.write ? "w" : "-"}${perm.execute ? "x" : "-"}`;

  return (
    `${permissionString(permissions.owner)}` +
    `${permissionString(permissions.group)}` +
    `${permissionString(permissions.others)}`
  );
}
