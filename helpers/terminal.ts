import { Terminal } from "@xterm/xterm";
import type { FileSystemNode, Process } from "~/types";
import {
  findNodeByAbsolutePath,
  findParentById,
  splitPath,
  findNodeByPath,
  resolvePath,
  getNextPid,
} from "~/helpers";
import { useWindowSize, useTimestamp } from "@vueuse/core";
import { defaultFilePermissions, defaultFolderPermissions } from "@/constants";

const { editItem, createItem, moveItem, deleteItem } = useDesktopStore();
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

  if (targetNode.type !== "folder") {
    term.write(`\r\ncd: ${toDir}: Not a directory`);
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
  if (args.length < 2) {
    term.write("\r\nchmod: missing operand");
    return false;
  }

  const [mode, targetPath] = args;
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

/**
 * Recursively traverses the file system and builds the tree structure.
 * @param node The current FileSystemNode.
 * @param prefix The string prefix for the current level (e.g., "│   ", "    ").
 * @param isLast Indicates if the current node is the last child of its parent.
 * @param depth The maximum depth to traverse.
 * @param currentDepth The current depth in the traversal.
 * @param lines An array to accumulate the tree lines.
 */
function traverseTree(
  node: FileSystemNode,
  prefix: string,
  isLast: boolean,
  depth: number,
  currentDepth: number,
  lines: string[],
): void {
  if (currentDepth > depth) return;

  // Determine the connector based on whether it's the last child
  const connector = isLast ? "└── " : "├── ";

  // Construct the current line with prefix and connector
  const line = `${prefix}${connector}${formatNodeName(node)}`;
  lines.push(line);

  // If the node is a folder and has children, traverse them
  if (node.type === "folder" && node.children && node.children.length > 0) {
    // Update the prefix for child nodes
    const newPrefix = prefix + (isLast ? "    " : "│   ");

    node.children!.forEach((child, index) => {
      const isLastChild = index === node.children!.length - 1;
      traverseTree(
        child,
        newPrefix,
        isLastChild,
        depth,
        currentDepth + 1,
        lines,
      );
    });
  }
}

/**
 * Handler for the 'tree' command.
 * @param term The terminal instance.
 * @param args The array of arguments passed to the command.
 * @param fileSystem The root FileSystemNode.
 * @param currentDirectoryNode The current directory FileSystemNode.
 * @returns True if the command executes successfully, else false.
 */
export function handleTree(
  term: Terminal,
  args: string[],
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
): boolean {
  try {
    // Initialize default values
    let level = 1; // Default depth
    let targetPath = "."; // Default to current directory

    // Iterate over the arguments
    let i = 0;
    while (i < args.length) {
      const arg = args[i];
      if (arg === "-L") {
        // Ensure the next argument exists
        if (i + 1 >= args.length) {
          term.write(`\r\ntree: option requires an argument -- 'L'`);
          return false;
        }
        const levelArg = args[i + 1];
        const parsedLevel = parseInt(levelArg, 10);

        // Validate the level argument
        if (isNaN(parsedLevel) || parsedLevel < 1) {
          term.write(`\r\ntree: invalid level: '${levelArg}'`);
          return false;
        }

        level = parsedLevel;
        i += 2; // Skip the flag and its value
      } else if (arg.startsWith("-")) {
        // Handle unknown flags
        term.write(`\r\ntree: unknown option '${arg}'`);
        return false;
      } else {
        // Positional argument (path)
        targetPath = arg;
        i += 1;
      }
    }

    // Resolve the target path
    const targetNode = resolvePath(
      fileSystem,
      currentDirectoryNode,
      targetPath,
    );

    if (!targetNode) {
      term.write(
        `\r\ntree: cannot access '${targetPath}': No such file or directory`,
      );
      return false;
    }

    // Initialize the lines array with the root node
    const lines: string[] = [];

    // Add the root node
    if (targetPath === "." || targetPath === "") {
      lines.push(".");
    } else {
      lines.push(formatNodeName(targetNode));
    }

    // Traverse the tree and populate the lines array
    if (
      targetNode.type === "folder" &&
      targetNode.children &&
      targetNode.children.length > 0
    ) {
      targetNode.children.forEach((child, index) => {
        const isLastChild = index === targetNode.children!.length - 1;
        traverseTree(child, "", isLastChild, level, 1, lines); // Start at depth 1
      });
    }

    // Write the lines to the terminal
    lines.forEach((line) => {
      term.write(`\r\n${line}`);
    });

    return true;
  } catch (error) {
    term.write(`\r\ntree: an unexpected error occurred.`);
    console.error("Error in handleTree:", error);
    return false;
  }
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

export function handleFree(term: Terminal, args: string[]): boolean {
  // Allow only 'free' or 'free -h'
  if (args.length > 1) {
    term.write(`\r\nfree: too many arguments provided.`);
    return false;
  }

  let humanReadable = false;

  if (args.length === 1) {
    if (args[0] === "-h") {
      humanReadable = true;
    } else {
      term.write(
        `\r\nfree: invalid option '${args[0]}'. Only '-h' is supported.`,
      );
      return false;
    }
  }

  const { memoryUsedPercentage } = storeToRefs(useGlobalStore());
  const total = 15406;
  const used = Math.round((memoryUsedPercentage.value / 100) * total);
  const remaining = total - used;

  // Generate 'shared' memory (up to 5% of remaining or 10% of used)
  const maxShared = Math.min(remaining * 0.05, used * 0.1);
  const shared = Math.round(getRandomInt(0, Math.floor(maxShared)));

  const remainingAfterShared = remaining - shared;

  // Generate 'free' memory (up to 60% of remaining after shared)
  const maxFree = Math.floor(remainingAfterShared * 0.6);
  const free = Math.round(getRandomInt(0, maxFree));

  // 'buff/cache' is the rest
  const buffCache = remainingAfterShared - free;

  // 'available' memory is 'free' + 'buff/cache'
  const available = free + buffCache;

  // Swap is fixed at 0
  const swapTotal = 0;
  const swapUsed = 0;
  const swapFree = 0;

  const headers = [
    "total",
    "used",
    "free",
    "shared",
    "buff/cache",
    "available",
  ];
  const widths = [10, 10, 10, 10, 15, 15];
  const headerLine = headers
    .map((header, idx) => header.padStart(widths[idx]))
    .join("  ");
  const fullHeader = "       " + headerLine + "\n";

  const memValues = [total, used, free, shared, buffCache, available];
  const swapValues = [swapTotal, swapUsed, swapFree];

  const memLine = formatFreeRow("Mem:", memValues, humanReadable, widths);
  const swapLine = formatFreeRow("Swap:", swapValues, humanReadable, widths);

  const output = fullHeader + memLine + "\n" + swapLine;

  term.write(`\r\n${output}`);
  return true;
}

/**
 * Generates a random integer between min and max (inclusive).
 * @param min The minimum integer value.
 * @param max The maximum integer value.
 * @returns A random integer between min and max.
 */
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Formats a number of kilobytes into a human-readable string with units.
 * @param kilobytes The number of kilobytes.
 * @param decimals The number of decimal places to include.
 * @returns The formatted string (e.g., "15GiB").
 */
function formatBytes(kilobytes: number, decimals: number = 1): string {
  if (kilobytes === 0) return "0B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["KiB", "MiB", "GiB", "TiB", "PiB"];

  // Convert kilobytes to bytes
  const bytes = kilobytes * 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Ensure index does not exceed the sizes array
  const index = i < sizes.length ? i : sizes.length - 1;

  return parseFloat((bytes / Math.pow(k, index)).toFixed(dm)) + sizes[index];
}

/**
 * Formats a row with a label and corresponding values.
 * @param label The label for the row (e.g., 'Mem:', 'Swap:').
 * @param values The array of values corresponding to each column.
 * @param humanReadable Whether to format the numbers in a human-readable format.
 * @param widths The array of column widths.
 * @returns The formatted row string.
 */
function formatFreeRow(
  label: string,
  values: number[],
  humanReadable: boolean,
  widths: number[],
): string {
  const formattedValues = values
    .map((val, idx) => {
      if (humanReadable) {
        return formatBytes(val, 1).padStart(widths[idx]);
      } else {
        return val.toString().padStart(widths[idx]);
      }
    })
    .join("  ");

  return `${label.padEnd(6)} ${formattedValues}`;
}

export function handleDf(term: Terminal, args: string[]): boolean {
  // Allow only 'df' or 'df -h'
  if (args.length > 1) {
    term.write(`\r\ndf: too many arguments provided.`);
    return false;
  }

  let humanReadable = false;

  if (args.length === 1) {
    if (args[0] === "-h") {
      humanReadable = true;
    } else {
      term.write(
        `\r\ndf: invalid option '${args[0]}'. Only '-h' is supported.`,
      );
      return false;
    }
  }

  // Define column headers and widths
  const headers = ["Filesystem", "Size", "Used", "Avail", "Use%", "Mounted on"];
  const widths = [20, 10, 10, 10, 6, 25];

  // Construct the header line with proper alignment
  const headerLine = headers
    .map((header, idx) => {
      if (idx === 0 || idx === headers.length - 1) {
        // Left-align 'Filesystem' and 'Mounted on'
        return header.padEnd(widths[idx]);
      } else {
        // Right-align numeric headers
        return header.padStart(widths[idx]);
      }
    })
    .join("  ");

  const fullHeader = headerLine + "\n";

  // Total size of approximately 1 TB
  const mockFilesystems = [
    { filesystem: "/dev/nvme0n1p5", mountedOn: "/", size: 1018176000 },
    { filesystem: "/dev/nvme0n1p1", mountedOn: "/boot/efi", size: 96000 },
    { filesystem: "dev", mountedOn: "/dev", size: 7500000 },
    { filesystem: "run", mountedOn: "/run", size: 7600000 },
    { filesystem: "tmpfs", mountedOn: "/tmp", size: 7600000 },
    { filesystem: "tmpfs", mountedOn: "/run/user/1000", size: 7600000 },
    { filesystem: "tmpfs", mountedOn: "/dev/shm", size: 7600000 },
  ];

  // Generate disk usage data with random values
  const dfData = mockFilesystems.map((fs) => {
    const total = fs.size;
    const used = getRandomInt(0, total);
    const avail = total - used;
    const usePercent = total === 0 ? 0 : Math.round((used / total) * 100);

    return {
      filesystem: fs.filesystem,
      size: humanReadable ? formatBytes(total) : total.toString(),
      used: humanReadable ? formatBytes(used) : used.toString(),
      avail: humanReadable ? formatBytes(avail) : avail.toString(),
      usePercent: `${usePercent}%`,
      mountedOn: fs.mountedOn,
    };
  });

  // Prepare disk usage lines
  const dfLines = dfData.map((fs) => {
    return formatDfRow(
      fs.filesystem,
      fs.size,
      fs.used,
      fs.avail,
      fs.usePercent,
      fs.mountedOn,
      humanReadable,
      widths,
    );
  });

  const output = fullHeader + dfLines.join("\n");
  term.write(`\r\n${output}`);
  return true;
}

/**
 * Formats a row for the 'df' command.
 * @param filesystem The name of the filesystem.
 * @param size The total size of the filesystem.
 * @param used The used space of the filesystem.
 * @param avail The available space of the filesystem.
 * @param usePercent The usage percentage of the filesystem.
 * @param mountedOn The mount point of the filesystem.
 * @param humanReadable Whether to format the numbers in a human-readable format.
 * @param widths The array of column widths.
 * @returns The formatted row string.
 */
function formatDfRow(
  filesystem: string,
  size: string,
  used: string,
  avail: string,
  usePercent: string,
  mountedOn: string,
  humanReadable: boolean,
  widths: number[],
): string {
  // Left-align 'Filesystem' and 'Mounted on'
  const filesystemPadded = filesystem.padEnd(widths[0]);
  const mountedOnPadded = mountedOn.padEnd(widths[5]);

  // Right-align numeric columns
  const sizeFormatted = humanReadable
    ? formatBytes(parseInt(size) * 1024)
    : size.padStart(widths[1]);
  const usedFormatted = humanReadable
    ? formatBytes(parseInt(used) * 1024)
    : used.padStart(widths[2]);
  const availFormatted = humanReadable
    ? formatBytes(parseInt(avail) * 1024)
    : avail.padStart(widths[3]);
  const usePercentFormatted = usePercent.padStart(widths[4]);

  return `${filesystemPadded}  ${sizeFormatted.padStart(widths[1])}  ${usedFormatted.padStart(widths[2])}  ${availFormatted.padStart(widths[3])}  ${usePercentFormatted}  ${mountedOnPadded}`;
}

export function handleCat(
  term: Terminal,
  args: string[],
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
): boolean {
  // Allow only 'cat' with exactly one argument
  // TODO: Add help message
  if (args.length !== 1) {
    term.write(`\r\ncat: missing operand`);
    return false;
  }

  const filePath = args[0];
  let targetNode: FileSystemNode | null = null;

  if (filePath.startsWith("/")) {
    // Absolute path
    targetNode = findNodeByAbsolutePath(fileSystem, filePath);
  } else {
    // Relative path
    targetNode = findNodeByPath(currentDirectoryNode, splitPath(filePath));
  }

  if (!targetNode) {
    term.write(`\r\ncat: ${filePath}: No such file or directory`);
    return false;
  }

  if (targetNode.type !== "file") {
    term.write(`\r\ncat: ${filePath}: Is a directory`);
    return false;
  }

  term.write(`\r\n${targetNode.content}`);
  return true;
}

export function handleTouch(
  term: Terminal,
  args: string[],
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
): boolean {
  // Allow only 'touch' with exactly one argument
  if (args.length !== 1) {
    term.write(`\r\ntouch: missing file operand`);
    return false;
  }

  const filePath = args[0];
  let targetDirectory: FileSystemNode;
  let fileName: string;

  if (filePath.startsWith("/")) {
    // Absolute path
    const pathParts = splitPath(filePath);
    fileName = pathParts.pop() || "";
    const dirPath = pathParts.join("/");
    targetDirectory =
      findNodeByAbsolutePath(fileSystem, dirPath) || currentDirectoryNode;
  } else {
    // Relative path
    const pathParts = splitPath(filePath);
    fileName = pathParts.pop() || "";
    if (pathParts.length > 0) {
      targetDirectory =
        findNodeByPath(currentDirectoryNode, pathParts) || currentDirectoryNode;
    } else {
      targetDirectory = currentDirectoryNode;
    }
  }

  // Check if node already exists
  const existingNode = targetDirectory.children?.find(
    (child) => child.name === fileName,
  );
  if (!existingNode) {
    createItem(targetDirectory.id, {
      name: fileName,
      type: "file",
      icon: "file:file",
      permissions: defaultFilePermissions,
    });
  }
  return true;
}

export function handleMkdir(
  term: Terminal,
  args: string[],
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
): boolean {
  // Allow only 'mkdir' with exactly one argument
  if (args.length !== 1) {
    term.write(`\r\nmkdir: missing directory operand`);
    return false;
  }

  const dirPath = args[0];
  let targetDirectory: FileSystemNode;
  let dirName: string;

  if (dirPath.startsWith("/")) {
    // Absolute path
    const pathParts = splitPath(dirPath);
    dirName = pathParts.pop() || "";
    const parentPath = pathParts.join("/");
    targetDirectory =
      findNodeByAbsolutePath(fileSystem, parentPath) || currentDirectoryNode;
  } else {
    // Relative path
    const pathParts = splitPath(dirPath);
    dirName = pathParts.pop() || "";
    if (pathParts.length > 0) {
      targetDirectory =
        findNodeByPath(currentDirectoryNode, pathParts) || currentDirectoryNode;
    } else {
      targetDirectory = currentDirectoryNode;
    }
  }

  // Check if node already exists
  const existingNode = targetDirectory.children?.find(
    (child) => child.name === dirName,
  );
  if (!existingNode) {
    createItem(targetDirectory.id, {
      name: dirName,
      type: "folder",
      icon: "folder:folder",
      permissions: defaultFolderPermissions,
    });
  }
  return true;
}

export function handleMv(
  term: Terminal,
  args: string[],
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
): boolean {
  if (args.length < 2) {
    term.write("\r\nmv: missing file operand");
    return false;
  }

  const sourcePath = args[0];
  const targetPath = args[1];

  // Find source node
  let sourceNode: FileSystemNode | null = null;
  if (sourcePath.startsWith("/")) {
    sourceNode = findNodeByAbsolutePath(fileSystem, sourcePath);
  } else {
    sourceNode = findNodeByPath(currentDirectoryNode, splitPath(sourcePath));
  }

  if (!sourceNode) {
    term.write(
      `\r\nmv: cannot stat '${sourcePath}': No such file or directory`,
    );
    return false;
  }

  // Find target node/parent
  let targetNode: FileSystemNode | null = null;
  if (targetPath.startsWith("/")) {
    targetNode = findNodeByAbsolutePath(fileSystem, targetPath);
  } else {
    targetNode = findNodeByPath(currentDirectoryNode, splitPath(targetPath));
  }

  if (!targetNode) {
    const targetPathParts = splitPath(targetPath);
    const parentPath = targetPathParts.join("/");

    let parentNode: FileSystemNode | null;
    if (targetPath.startsWith("/")) {
      parentNode = findNodeByAbsolutePath(fileSystem, parentPath);
    } else {
      parentNode = findNodeByPath(currentDirectoryNode, targetPathParts);
    }

    if (!parentNode || parentNode.type !== "folder") {
      term.write(
        `\r\nmv: cannot move '${sourcePath}' to '${targetPath}': No such directory`,
      );
      return false;
    }

    const success = moveItem(sourceNode.id, parentNode.id);
    if (!success) {
      term.write(
        `\r\nmv: cannot move '${sourcePath}' to '${targetPath}': Permission denied`,
      );
      return false;
    }
    return true;
  }

  // If target exists and is a directory, move source into it
  if (targetNode.type === "folder") {
    const success = moveItem(sourceNode.id, targetNode.id);
    if (!success) {
      term.write(
        `\r\nmv: cannot move '${sourcePath}' to '${targetPath}': Permission denied`,
      );
      return false;
    }
    return true;
  }

  term.write(`\r\nmv: cannot overwrite '${targetPath}'`);
  return false;
}

export function handleRm(
  term: Terminal,
  args: string[],
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
): boolean {
  if (args.length === 0) {
    term.write("\r\nrm: missing operand");
    return false;
  }

  let forceDelete = false;
  let targetPath = "";

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-f") {
      forceDelete = true;
    } else {
      if (targetPath) {
        term.write("\r\nrm: too many arguments");
        return false;
      }
      targetPath = args[i];
    }
  }

  if (!targetPath) {
    term.write("\r\nrm: missing operand");
    return false;
  }

  // Resolve target node
  let targetNode: FileSystemNode | null;
  if (targetPath.startsWith("/")) {
    targetNode = findNodeByAbsolutePath(fileSystem, targetPath);
  } else {
    targetNode = findNodeByPath(currentDirectoryNode, splitPath(targetPath));
  }

  if (!targetNode) {
    term.write(
      `\r\nrm: cannot remove '${targetPath}': No such file or directory`,
    );
    return false;
  }

  // Check if trying to delete a folder without -f flag
  if (targetNode.type === "folder" && !forceDelete) {
    term.write(`\r\nrm: cannot remove '${targetPath}': Is a directory`);
    return false;
  }

  const parentNode = findParentById(fileSystem, targetNode.id);
  if (!parentNode || parentNode.type !== "folder") {
    term.write(
      `\r\nrm: cannot remove '${targetPath}': No such file or directory`,
    );
    return false;
  }

  // Delete the item
  const success = deleteItem(targetNode.id);
  if (!success) {
    term.write(`\r\nrm: cannot remove '${targetPath}': Permission denied`);
    return false;
  }

  return true;
}

/**
 * Handler for the 'ps' command.
 * @param term The terminal instance.
 * @param args The array of arguments passed to the command.
 * @returns True if the command executes successfully, else false.
 */
export function handlePs(term: Terminal, args: string[]): boolean {
  // Allow only 'ps' without any arguments
  if (args.length > 0) {
    term.write(`\r\nps: too many arguments provided.`);
    return false;
  }

  // Define column headers and widths
  const headers = ["PID", "TTY", "TIME", "CMD"];
  const widths = [6, 12, 10, 25];

  const headerLine = headers
    .map((header, idx) => {
      if (idx === 0) {
        // Right-align 'PID'
        return header.padStart(widths[idx]);
      } else {
        // Left-align 'TTY', 'TIME', and 'CMD'
        return header.padEnd(widths[idx]);
      }
    })
    .join("  ");

  const fullHeader = headerLine + "\n";

  const { processes } = storeToRefs(useDesktopStore());

  // Format each process into a row with default TTY "pts/1"
  const psLines = processes.value.map((proc) => {
    const time = formatTime(proc.startTimeTimestamp);
    return formatPsRow(proc.pid, "pts/1", time, proc.command, widths);
  });

  // Add the 'ps' process itself with TTY "pts/2"
  const currentTimeTimestamp = useTimestamp({ offset: 0 }).value;
  const psProcess = {
    pid: getNextPid(processes.value),
    time: formatTime(currentTimeTimestamp),
    cmd: "ps",
  };
  psLines.push(
    formatPsRow(psProcess.pid, "pts/2", psProcess.time, psProcess.cmd, widths),
  );

  const output = fullHeader + psLines.join("\n");

  term.write(`\r\n${output}`);
  return true;
}

/**
 * Formats a row for the 'ps' command.
 * @param pid The Process ID.
 * @param tty The terminal associated with the process.
 * @param time The cumulative CPU time the process has used.
 * @param cmd The command that initiated the process.
 * @param widths The array of column widths.
 * @returns The formatted row string.
 */
function formatPsRow(
  pid: number,
  tty: string,
  time: string,
  cmd: string,
  widths: number[],
): string {
  const pidPadded = pid.toString().padStart(widths[0]);
  const ttyPadded = tty.padEnd(widths[1]);
  const timePadded = time.padEnd(widths[2]);
  const cmdPadded = cmd.padEnd(widths[3]);
  return `${pidPadded}  ${ttyPadded}  ${timePadded}  ${cmdPadded}`;
}

/**
 * Converts a timestamp or duration into "HH:MM:SS" format.
 * @param timestamp The timestamp in milliseconds.
 * @returns The formatted time string.
 */
function formatTime(timestamp: number): string {
  // Get current timestamp
  const now = Date.now();

  // Calculate elapsed time in seconds
  const elapsedSeconds = Math.floor((now - timestamp) / 1000);

  // Calculate hours, minutes, seconds
  const hours = Math.floor(elapsedSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((elapsedSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
