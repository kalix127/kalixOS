import type { Terminal } from "@xterm/xterm";
import type {
  CommandSpec,
  Node,
  ParsedArgs,
  PermissionsNode,
} from "@/types";
import { useTimestamp, useWindowSize } from "@vueuse/core";
import { defaultFilePermissions, defaultFolderPermissions } from "@/constants";
import { helpMessages } from "@/constants/helpMessages";
import {
  findNodeByIdRecursive,
  getNextPid,
  resolvePath,
  splitPath,
} from "@/helpers";

const { editNode, createNode, moveNode, deleteNode, createNodeShortcut }
  = useDesktopStore();
const { setCurrentDirectory } = useTerminalStore();

export function handleCd(
  term: Terminal,
  parsedArgs: ParsedArgs,
  fileSystem: Node,
  currentDirectoryNode: Node,
): boolean {
  const { positionalArgs } = parsedArgs;
  const toDir = positionalArgs[0];

  if (!toDir) {
    const { homeNode } = storeToRefs(useDesktopStore());
    if (homeNode.value) {
      setCurrentDirectory(homeNode.value);
    }
    return true;
  }

  const targetNode = resolvePath(fileSystem, currentDirectoryNode, toDir);

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
  parsedArgs: ParsedArgs,
  fileSystem: Node,
  currentDirectoryNode: Node,
): boolean {
  const { flags, positionalArgs } = parsedArgs;
  const longFormat = flags.includes("-l");
  const showAll = flags.includes("-a");

  const path = positionalArgs[0] || ".";
  const targetNode = resolvePath(fileSystem, currentDirectoryNode, path);

  if (!targetNode) {
    term.write(`\r\nls: cannot access '${path}': No such file or directory`);
    return false;
  }

  if (targetNode.type !== "folder") {
    term.write(`\r\nls: cannot access '${path}': Not a directory`);
    return false;
  }

  const nodes = targetNode.children;

  const filteredNodes = showAll
    ? nodes
    : nodes.filter(node => !node.name.startsWith("."));

  if (longFormat) {
    const maxOwnerLength = Math.max(
      ...filteredNodes.map(node => node.owner.length),
      5,
    );
    const maxGroupLength = Math.max(
      ...filteredNodes.map(node => node.group.length),
      5,
    );
    const maxSizeLength = Math.max(
      ...filteredNodes.map((node) => {
        const size
          = node.type === "file" ? `${node.content?.length ?? 0}` : "4096";
        return size.length;
      }),
      4,
    );

    filteredNodes.forEach((node) => {
      let nodeName = node.name;

      const permissions = formatPermissions(node.type, node.permissions);
      const size = node.type === "file" ? (node.content?.length ?? 0) : 4096;
      const sizeStr = size.toString();

      const date = formatLsDate(node.createdAt);
      const owner = node.owner;
      const group = node.group;
      nodeName = formatNodeName(node, fileSystem, true);

      term.write(
        `\r\n${permissions} ${owner.padEnd(maxOwnerLength)} ${group.padEnd(
          maxGroupLength,
        )} ${sizeStr.padStart(maxSizeLength)} ${date} ${nodeName}`,
      );
    });
    return true;
  }
  const output = filteredNodes
    .map(node => formatNodeName(node, fileSystem))
    .join("  ");
  if (output.trim() !== "") {
    term.write(`\r\n${output}`);
  }
  return true;
}

export function handleLn(
  term: Terminal,
  parsedArgs: ParsedArgs,
  fileSystem: Node,
  currentDirectoryNode: Node,
): boolean {
  const { flags, positionalArgs } = parsedArgs;
  if (!flags.includes("-s")) {
    term.write("\r\nln: symbolic link flag (-s) is required");
    return false;
  }

  if (positionalArgs.length < 2) {
    term.write("\r\nln: missing operand");
    return false;
  }

  const targetPath = positionalArgs[0];
  const linkPath = positionalArgs[1];

  if (!targetPath || !linkPath) {
    term.write("\r\nln: missing operand");
    return false;
  }

  const targetNode = resolvePath(fileSystem, currentDirectoryNode, targetPath);
  if (!targetNode) {
    term.write(
      `\r\nln: failed to access '${targetPath}': No such file or directory`,
    );
    return false;
  }

  const linkPathSegments = splitPath(linkPath);
  const linkName = linkPathSegments.pop()!;
  const linkParentPath
    = linkPathSegments.length > 0 ? linkPathSegments.join("/") : "./";

  const linkNode = resolvePath(fileSystem, currentDirectoryNode, linkPath);
  if (linkNode) {
    term.write(
      `\r\nln: failed to create symbolic link '${linkPath}': File exists`,
    );
    return false;
  }

  const linkParentNode = resolvePath(
    fileSystem,
    currentDirectoryNode,
    linkParentPath,
  );

  if (!linkParentNode || linkParentNode.type !== "folder") {
    term.write(`\r\nln: failed to access '${linkParentPath}': Not a directory`);
    return false;
  }

  const [success, message] = createNodeShortcut(
    targetNode,
    linkParentNode,
    linkName,
  );
  if (!success) {
    term.write(`\r\nln: ${message}`);
    return false;
  }
  return true;
}

export function handleTree(
  term: Terminal,
  args: string[],
  fileSystem: Node,
  currentDirectoryNode: Node,
): boolean {
  try {
    let level = 1;
    let targetPath = ".";

    let i = 0;
    while (i < args.length) {
      const arg = args[i];
      if (arg === "-L") {
        const levelArg = args[i + 1];
        if (!levelArg) {
          term.write(`\r\ntree: option requires an argument -- 'L'`);
          return false;
        }
        if (i + 1 >= args.length) {
          term.write(`\r\ntree: option requires an argument -- 'L'`);
          return false;
        }
        const parsedLevel = Number.parseInt(levelArg, 10);

        if (Number.isNaN(parsedLevel) || parsedLevel < 1) {
          term.write(`\r\ntree: invalid level: '${levelArg}'`);
          return false;
        }

        level = parsedLevel;
        i += 2;
      } else if (arg?.startsWith("-")) {
        term.write(`\r\ntree: unknown option '${arg}'`);
        return false;
      } else if (arg) {
        targetPath = arg;
        i += 1;
      }
    }

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

    const lines: string[] = [];

    if (targetPath === "." || targetPath === "") {
      lines.push(".");
    } else {
      lines.push(formatNodeName(targetNode));
    }

    if (
      targetNode.type === "folder"
      && targetNode.children
      && targetNode.children.length > 0
    ) {
      targetNode.children.forEach((child, index) => {
        const isLastChild = index === targetNode.children!.length - 1;
        traverseTree(child, "", isLastChild, level, 1, lines);
      });
    }

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

export function handleChown(
  term: Terminal,
  parsedArgs: ParsedArgs,
  fileSystem: Node,
  currentDirectoryNode: Node,
): boolean {
  const { positionalArgs } = parsedArgs;
  if (positionalArgs.length < 2) {
    term.write(`\r\nchown: missing operand`);
    return false;
  }

  const userGroup = positionalArgs[0];
  const targetPath = positionalArgs[1];
  if (!userGroup || !targetPath) {
    term.write(`\r\nchown: missing operand`);
    return false;
  }

  const [user, group] = userGroup.split(":");

  if (!user || !group) {
    term.write(`\r\nchown: invalid format; expected 'user:group'`);
    return false;
  }

  const targetNode = resolvePath(fileSystem, currentDirectoryNode, targetPath);
  if (!targetNode) {
    term.write(
      `\r\nchown: cannot access '${targetPath}': No such file or directory`,
    );
    return false;
  }

  const success = editNode(targetNode.id, { owner: user, group });
  if (!success) {
    term.write(
      `\r\nchown: cannot change owner of '${targetPath}': Permission denied`,
    );
    return false;
  }

  return true;
}

function getPermissionKey(flag: string): "read" | "write" | "execute" {
  switch (flag) {
    case "r":
      return "read";
    case "w":
      return "write";
    default:
      return "execute";
  }
}

export function handleChmod(
  term: Terminal,
  parsedArgs: ParsedArgs,
  fileSystem: Node,
  currentDirectoryNode: Node,
): boolean {
  const { positionalArgs } = parsedArgs;

  if (positionalArgs.length < 2) {
    term.write("\r\nchmod: missing operand");
    return false;
  }

  const mode = positionalArgs[0];
  const targetPath = positionalArgs[1];
  if (!mode || !targetPath) {
    term.write("\r\nchmod: missing operand");
    return false;
  }

  const targetNode = resolvePath(fileSystem, currentDirectoryNode, targetPath);
  if (!targetNode) {
    term.write(
      `\r\nchmod: cannot access '${targetPath}': No such file or directory`,
    );
    return false;
  }

  if (/^[ugoa]*[+-=][rwx]+$/.test(mode)) {
    const permissions = { ...targetNode.permissions };
    const targets: Array<"owner" | "group" | "others"> = [];
    if (!/[ugo]/.test(mode.charAt(0)) || mode.startsWith("a")) {
      targets.push("owner", "group", "others");
    } else {
      if (mode.includes("u"))
        targets.push("owner");
      if (mode.includes("g"))
        targets.push("group");
      if (mode.includes("o"))
        targets.push("others");
    }

    const operation = mode.match(/[+-=]/)?.[0];
    const permissionTypes = mode.match(/[rwx]+/)?.[0]?.split("") ?? [];

    if (!operation) {
      term.write(`\r\nchmod: invalid mode: '${mode}'`);
      return false;
    }

    targets.forEach((target) => {
      permissionTypes.forEach((perm) => {
        const permKey = getPermissionKey(perm);
        switch (operation) {
          case "+":
            permissions[target][permKey] = true;
            break;
          case "-":
            permissions[target][permKey] = false;
            break;
          case "=":
            permissions[target] = { read: false, write: false, execute: false };
            permissions[target][permKey] = true;
            break;
        }
      });
    });

    const success = editNode(targetNode.id, { permissions });
    if (!success) {
      term.write(
        `\r\nchmod: cannot change permissions of '${targetPath}': Permission denied`,
      );
      return false;
    }

    return true;
  } else if (/^[0-7]{3}$/.test(mode)) {
    const values = mode.split("").map(char => Number.parseInt(char, 8));

    const newPermissions: PermissionsNode = {
      owner: {
        read: Boolean((values[0] ?? 0) & 4),
        write: Boolean((values[0] ?? 0) & 2),
        execute: Boolean((values[0] ?? 0) & 1),
      },
      group: {
        read: Boolean((values[1] ?? 0) & 4),
        write: Boolean((values[1] ?? 0) & 2),
        execute: Boolean((values[1] ?? 0) & 1),
      },
      others: {
        read: Boolean((values[2] ?? 0) & 4),
        write: Boolean((values[2] ?? 0) & 2),
        execute: Boolean((values[2] ?? 0) & 1),
      },
    };

    const success = editNode(targetNode.id, { permissions: newPermissions });
    if (!success) {
      term.write(
        `\r\nchmod: cannot change permissions of '${targetPath}': Permission denied`,
      );
      return false;
    }

    return true;
  } else {
    term.write(`\r\nchmod: invalid mode: '${mode}'`);
    return false;
  }
}
export function handleTouch(
  term: Terminal,
  parsedArgs: ParsedArgs,
  fileSystem: Node,
  currentDirectoryNode: Node,
): boolean {
  const { positionalArgs } = parsedArgs;

  if (positionalArgs.length !== 1) {
    term.write(`\r\ntouch: missing file operand`);
    return false;
  }

  const filePath = positionalArgs[0];
  if (!filePath) {
    term.write(`\r\ntouch: missing file operand`);
    return false;
  }

  const pathParts = splitPath(filePath);
  const fileName = pathParts.pop() || "";
  const dirPath = pathParts.join("/");

  const targetDirectory = resolvePath(
    fileSystem,
    currentDirectoryNode,
    dirPath || ".",
  );

  if (!targetDirectory) {
    term.write(
      `\r\ntouch: cannot touch '${filePath}': No such file or directory`,
    );
    return false;
  }

  if (targetDirectory.type !== "folder") {
    term.write(`\r\ntouch: cannot touch '${filePath}': Not a directory`);
    return false;
  }

  const existingNode = targetDirectory.children.find(
    child => child.name === fileName,
  );

  if (!existingNode) {
    const newNode = createNode(targetDirectory.id, {
      name: fileName,
      type: "file",
      permissions: defaultFilePermissions,
    });

    if (!newNode) {
      term.write(
        `\r\ntouch: cannot create file '${fileName}': Permission denied`,
      );
      return false;
    }
  }

  return true;
}
export function handleMkdir(
  term: Terminal,
  parsedArgs: ParsedArgs,
  fileSystem: Node,
  currentDirectoryNode: Node,
): boolean {
  const { positionalArgs } = parsedArgs;

  if (positionalArgs.length !== 1) {
    term.write(`\r\nmkdir: missing directory operand`);
    return false;
  }

  const dirPath = positionalArgs[0];
  if (!dirPath) {
    term.write(`\r\nmkdir: missing directory operand`);
    return false;
  }

  const pathParts = splitPath(dirPath);
  const dirName = pathParts.pop() || "";
  const parentPath = pathParts.join("/");

  const targetDirectory = resolvePath(
    fileSystem,
    currentDirectoryNode,
    parentPath || ".",
  );

  if (!targetDirectory) {
    term.write(
      `\r\nmkdir: cannot create directory '${dirPath}': No such file or directory`,
    );
    return false;
  }

  if (targetDirectory.type !== "folder") {
    term.write(
      `\r\nmkdir: cannot create directory '${dirPath}': Not a directory`,
    );
    return false;
  }

  const existingNode = targetDirectory.children.find(
    child => child.name === dirName,
  );

  if (!existingNode) {
    const newNode = createNode(targetDirectory.id, {
      name: dirName,
      type: "folder",
      permissions: defaultFolderPermissions,
    });

    if (!newNode) {
      term.write(
        `\r\nmkdir: cannot create directory '${dirName}': Permission denied`,
      );
      return false;
    }
  } else {
    term.write(`\r\nmkdir: cannot create directory '${dirPath}': File exists`);
    return false;
  }

  return true;
}
export function handleMv(
  term: Terminal,
  parsedArgs: ParsedArgs,
  fileSystem: Node,
  currentDirectoryNode: Node,
): boolean {
  const { positionalArgs } = parsedArgs;

  if (positionalArgs.length < 2) {
    term.write("\r\nmv: missing file operand");
    return false;
  }

  const sourcePath = positionalArgs[0];
  const targetPath = positionalArgs[1];

  if (!sourcePath || !targetPath) {
    term.write("\r\nmv: missing file operand");
    return false;
  }

  const sourceNode = resolvePath(fileSystem, currentDirectoryNode, sourcePath);
  if (!sourceNode) {
    term.write(
      `\r\nmv: cannot stat '${sourcePath}': No such file or directory`,
    );
    return false;
  }

  const targetNode = resolvePath(fileSystem, currentDirectoryNode, targetPath);

  if (!targetNode) {
    const targetPathParts = splitPath(targetPath);
    const parentPath = targetPathParts.slice(0, -1).join("/");

    const parentNode = resolvePath(
      fileSystem,
      currentDirectoryNode,
      parentPath || ".",
    );
    if (!parentNode || parentNode.type !== "folder") {
      term.write(
        `\r\nmv: cannot move '${sourcePath}' to '${targetPath}': No such directory`,
      );
      return false;
    }

    const success = moveNode(sourceNode.id, parentNode.id);
    if (!success) {
      term.write(
        `\r\nmv: cannot move '${sourcePath}' to '${targetPath}': Permission denied`,
      );
      return false;
    }
    return true;
  }

  if (targetNode.type === "folder") {
    const success = moveNode(sourceNode.id, targetNode.id);
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
  parsedArgs: ParsedArgs,
  fileSystem: Node,
  currentDirectoryNode: Node,
): boolean {
  const { flags, positionalArgs } = parsedArgs;

  if (positionalArgs.length === 0) {
    term.write("\r\nrm: missing operand");
    return false;
  }

  const recursiveDelete = flags.includes("-r");
  const targetPath = positionalArgs[0];

  if (!targetPath) {
    term.write("\r\nrm: missing operand");
    return false;
  }

  const targetNode = resolvePath(fileSystem, currentDirectoryNode, targetPath);

  if (!targetNode) {
    term.write(
      `\r\nrm: cannot remove '${targetPath}': No such file or directory`,
    );
    return false;
  }

  if (targetNode.type === "folder" && !recursiveDelete) {
    term.write(`\r\nrm: cannot remove '${targetPath}': Is a directory`);
    return false;
  }

  if (!targetNode.parentId) {
    term.write(
      `\r\nrm: cannot remove '${targetPath}': No such file or directory`,
    );
    return false;
  }

  const parentNode = findNodeByIdRecursive(fileSystem, targetNode.parentId);
  if (!parentNode || parentNode.type !== "folder") {
    term.write(
      `\r\nrm: cannot remove '${targetPath}': No such file or directory`,
    );
    return false;
  }

  const success = deleteNode(targetNode.id);
  if (!success) {
    term.write(`\r\nrm: cannot remove '${targetPath}': Permission denied`);
    return false;
  }

  return true;
}
export function handleCat(
  term: Terminal,
  parsedArgs: ParsedArgs,
  fileSystem: Node,
  currentDirectoryNode: Node,
): boolean {
  const { positionalArgs } = parsedArgs;

  if (positionalArgs.length !== 1) {
    term.write(`\r\ncat: missing operand`);
    return false;
  }

  const filePath = positionalArgs[0];
  if (!filePath) {
    term.write(`\r\ncat: missing operand`);
    return false;
  }

  const targetNode = resolvePath(fileSystem, currentDirectoryNode, filePath);

  if (!targetNode) {
    term.write(`\r\ncat: ${filePath}: No such file or directory`);
    return false;
  }

  if (targetNode.type !== "file") {
    term.write(`\r\ncat: ${filePath}: Is a directory`);
    return false;
  }

  term.write(`\r\n${targetNode.content || ""}`);
  return true;
}
export function handlePs(term: Terminal, parsedArgs: ParsedArgs): boolean {
  const { positionalArgs } = parsedArgs;

  if (positionalArgs.length > 0) {
    term.write(`\r\nps: too many arguments provided.`);
    return false;
  }

  const headers = ["PID", "TTY", "TIME", "CMD"];
  const widths = [6, 12, 10, 25];

  const headerLine = headers
    .map((header, idx) => {
      const width = widths[idx] ?? 0;
      if (idx === 0) {
        return header.padStart(width);
      }
      return header.padEnd(width);
    })
    .join("  ");

  const fullHeader = `${headerLine}\n`;

  const { processes } = storeToRefs(useDesktopStore());

  const psLines = processes.value.map((proc) => {
    const time = formatPsTime(proc.startTimeTimestamp);
    return formatPsRow(proc.pid, "pts/1", time, proc.command, widths);
  });

  const currentTimeTimestamp = useTimestamp({ offset: 0 }).value;
  const psProcess = {
    pid: getNextPid(processes.value),
    time: formatPsTime(currentTimeTimestamp),
    cmd: "ps",
  };
  psLines.push(
    formatPsRow(psProcess.pid, "pts/2", psProcess.time, psProcess.cmd, widths),
  );

  const output = fullHeader + psLines.join("\n");

  term.write(`\r\n${output}`);
  return true;
}
export function handleKill(term: Terminal, parsedArgs: ParsedArgs): boolean {
  const { positionalArgs } = parsedArgs;

  if (positionalArgs.length !== 1) {
    term.write("\r\nkill: usage: kill <pid>");
    return false;
  }

  if (!positionalArgs[0]) {
    term.write("\r\nkill: missing pid argument");
    return false;
  }

  const pid = Number.parseInt(positionalArgs[0]);
  if (Number.isNaN(pid)) {
    term.write("\r\nkill: argument must be a number");
    return false;
  }

  const desktopStore = useDesktopStore();
  const { processes } = storeToRefs(desktopStore);
  const { closeApp } = desktopStore;
  const process = processes.value.find(p => p.pid === pid);

  if (!process) {
    term.write(`\r\nkill: (${pid}) - No such process`);
    return false;
  }

  closeApp(process.appId);
  return true;
}

export function handlePkill(term: Terminal, parsedArgs: ParsedArgs): boolean {
  const { flags, positionalArgs } = parsedArgs;

  const useFull = flags.includes("-f");

  if (!useFull || positionalArgs.length !== 1) {
    term.write("\r\npkill: usage: pkill -f <command>");
    return false;
  }

  if (!positionalArgs[0]) {
    term.write("\r\npkill: missing command argument");
    return false;
  }

  const command = positionalArgs[0].toLowerCase();
  const desktopStore = useDesktopStore();
  const { processes } = storeToRefs(desktopStore);
  const { closeApp } = desktopStore;
  const process = processes.value.find(
    p => p.command.toLowerCase() === command,
  );

  if (!process) {
    term.write(`\r\npkill: no process found matching '${command}'`);
    return false;
  }

  closeApp(process.appId);
  return true;
}
export function handleFree(term: Terminal, parsedArgs: ParsedArgs): boolean {
  const { flags, positionalArgs } = parsedArgs;

  if (positionalArgs.length > 0) {
    term.write(`\r\nfree: too many arguments provided.`);
    return false;
  }

  const humanReadable = flags.includes("-h");

  const { memoryUsedPercentage } = storeToRefs(useGlobalStore());
  const total = 15406;
  const used = Math.round((memoryUsedPercentage.value / 100) * total);
  const remaining = total - used;

  const maxShared = Math.min(remaining * 0.05, used * 0.1);
  const shared = Math.round(getRandomInt(0, Math.floor(maxShared)));

  const remainingAfterShared = remaining - shared;

  const maxFree = Math.floor(remainingAfterShared * 0.6);
  const free = Math.round(getRandomInt(0, maxFree));

  const buffCache = remainingAfterShared - free;

  const available = free + buffCache;

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
    .map((header, idx) => header.padStart(widths[idx] ?? 0))
    .join("  ");
  const fullHeader = `       ${headerLine}\n`;

  const memValues = [total, used, free, shared, buffCache, available];
  const swapValues = [swapTotal, swapUsed, swapFree];

  const memLine = formatFreeRow("Mem:", memValues, humanReadable, widths);
  const swapLine = formatFreeRow("Swap:", swapValues, humanReadable, widths);

  const output = `${fullHeader + memLine}\n${swapLine}`;

  term.write(`\r\n${output}`);
  return true;
}

export function handleDf(term: Terminal, parsedArgs: ParsedArgs): boolean {
  const { flags, positionalArgs } = parsedArgs;

  if (positionalArgs.length > 0) {
    term.write(`\r\ndf: too many arguments provided.`);
    return false;
  }

  const humanReadable = flags.includes("-h");

  const headers = ["Filesystem", "Size", "Used", "Avail", "Use%", "Mounted on"];
  const widths = [20, 10, 10, 10, 6, 25];

  const headerLine = headers
    .map((header, idx) => {
      const width = widths[idx] ?? 0;
      if (idx === 0 || idx === headers.length - 1) {
        return header.padEnd(width);
      }
      return header.padStart(width);
    })
    .join("  ");

  const fullHeader = `${headerLine}\n`;

  const mockFilesystems = [
    { filesystem: "/dev/nvme0n1p5", mountedOn: "/", size: 1018176000 },
    { filesystem: "/dev/nvme0n1p1", mountedOn: "/boot/efi", size: 96000 },
    { filesystem: "dev", mountedOn: "/dev", size: 7500000 },
    { filesystem: "run", mountedOn: "/run", size: 7600000 },
    { filesystem: "tmpfs", mountedOn: "/tmp", size: 7600000 },
    { filesystem: "tmpfs", mountedOn: "/run/user/1000", size: 7600000 },
    { filesystem: "tmpfs", mountedOn: "/dev/shm", size: 7600000 },
  ];

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

export function handleNeofetch(
  term: Terminal,
  username: string,
  hostname: string,
): void {
  const { uptime } = storeToRefs(useDesktopStore());
  const readableUptime = formatUptime(uptime.value);

  const { width, height } = useWindowSize();
  const resolution = `${width.value}x${height.value}`;

  const { memoryUsedPercentage } = storeToRefs(useGlobalStore());
  const memoryUsed = Math.round((memoryUsedPercentage.value / 100) * 15406);

  const { githubUrl } = useRuntimeConfig().public;

  const authorLink = generateLink(githubUrl, "@kalix127");
  const themeLink = generateLink(
    "https://github.com/lassekongo83/adw-gtk3",
    "adw-gtk3 [GTK2/3]",
  );
  const iconLink = generateLink(
    "https://github.com/PapirusDevelopmentTeam/papirus-icon-theme",
    "Papirus-Dark [GTK2/3]",
  );

  const neoFetch = `
  \x1B[1;36m                    -'                    ${username}\x1B[1;37m@\x1B[1;36m${hostname}
  \x1B[1;36m                   .o+'                   \x1B[1;37m-------------------
  \x1B[1;36m                  'ooo/                   Author:\x1B[1;37m ${authorLink}
  \x1B[1;36m                 '+oooo:                  OS:\x1B[1;37m Manjaro Linux x86_64 
  \x1B[1;36m                '+oooooo:                 Host:\x1B[1;37m ${hostname}
  \x1B[1;36m                -+oooooo+:                Kernel:\x1B[1;37m 6.10.13-3-MANJARO
  \x1B[1;36m              '/:-:++oooo+:               Uptime:\x1B[1;37m ${readableUptime}
  \x1B[1;36m             '/++++/+++++++:              Packages:\x1B[1;37m 782 (pacman)
  \x1B[1;36m            '/++++++++++++++:             Shell:\x1B[1;37m zsh
  \x1B[1;36m           '/+++ooooooooooooo/'           Resolution:\x1B[1;37m ${resolution} 
  \x1B[1;36m          ./ooosssso++osssssso+'          DE:\x1B[1;37m GNOME
  \x1B[1;36m         .oossssso-''''/ossssss+'         VM:\x1B[1;37m Mutter
  \x1B[1;36m        -osssssso.      :ssssssso.        Theme:\x1B[1;37m ${themeLink}
  \x1B[1;36m       :osssssss/        osssso+++.       Icons:\x1B[1;37m ${iconLink}
  \x1B[1;36m      /ossssssss/        +ssssooo/-       Terminal:\x1B[1;37m gnome-terminal
  \x1B[1;36m    '/ossssso+/:-        -:/+osssso+-     CPU:\x1B[1;37m AMD Ryzen™ 9 5900X 
  \x1B[1;36m   '+sso+:-'                 '.-/+oso:    GPU:\x1B[1;37m NVIDIA GeForce RTX 4060 Mobile
  \x1B[1;36m  '++:.                           '-/+/   Memory:\x1B[1;37m ${memoryUsed}MiB / 15406MiB
  \x1B[1;36m  .'                                 '/   

`;
  term.clear();
  term.write(`${neoFetch}`);
}

export function handleHelp(term: Terminal): boolean {
  const generalHelp = helpMessages.help;
  term.write(`\r\n${generalHelp}`);
  return true;
}

export function parseArguments(
  commandName: string,
  args: string[],
  commandSpec: CommandSpec,
): ParsedArgs {
  const flags: string[] = [];
  const flagValues: { [key: string]: string } = {};
  const positionalArgs: string[] = [];

  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    if (arg?.startsWith("-")) {
      if (arg?.startsWith("--")) {
        const alias = commandSpec.flagAliases[arg];
        if (alias) {
          if (commandSpec.flagsWithValues?.includes(alias)) {
            const value = args[++i];
            if (!value) {
              throw new Error(`Option '${arg}' requires a value`);
            }
            flagValues[alias] = value;
          } else {
            flags.push(alias);
          }
        } else {
          throw new Error(`Unknown option '${arg}'`);
        }
      } else {
        const chars = arg.slice(1).split("");
        let consumedValue = false;
        for (let j = 0; j < chars.length; j++) {
          const char = chars[j];
          const flag = `-${char}`;
          if (commandSpec.acceptsFlags.includes(flag)) {
            if (commandSpec.flagsWithValues?.includes(flag)) {
              let value = "";
              if (j < chars.length - 1) {
                value = chars.slice(j + 1).join("");
              } else {
                const nextArg = args[++i];
                if (nextArg === undefined) {
                  throw new Error(`Option '${flag}' requires a value`);
                }
                value = nextArg;
              }
              if (!value) {
                throw new Error(`Option '${flag}' requires a value`);
              }
              flagValues[flag] = value;
              consumedValue = true;
              break;
            } else {
              flags.push(flag);
            }
          } else {
            throw new Error(`Unknown option '-${char}'`);
          }
        }
        if (consumedValue) {
          break;
        }
      }
    } else {
      if (arg === undefined) {
        throw new Error("Unexpected undefined argument");
      }
      positionalArgs.push(arg);
    }

    i++;
  }
  if (flags.includes("--help")) {
    return { flags, flagValues, positionalArgs };
  }

  if (commandName !== "df" && commandName !== "free" && flags.includes("-h")) {
    return { flags, flagValues, positionalArgs };
  }

  const requiredArgs
    = commandSpec.positionalArgs?.filter(arg => arg.required) || [];
  if (positionalArgs.length < requiredArgs.length) {
    const missingArg = requiredArgs[positionalArgs.length];
    if (!missingArg) {
      throw new Error("Invalid argument index");
    }
    throw new Error(
      `${missingArg.name}: missing required argument`,
    );
  }

  return { flags, flagValues, positionalArgs };
}

export function formatUptime(uptime: number): string {
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  return `${hours} hours, ${minutes} mins`;
}

export function generateLink(url: string, label: string): string {
  return `\x1B]8;;${url}\x07${label}\x1B]8;;\x07`;
}

export function formatNodeName(
  node: Node,
  fileSystem?: Node,
  longFormat: boolean = false,
): string {
  let displayName = node.name;
  if (node.type === "shortcut" && longFormat && fileSystem) {
    const targetNode = findNodeByIdRecursive(fileSystem, node.targetId);
    if (targetNode) {
      displayName = `\x1B[1;36m${displayName}\x1B[0m`;
      displayName += ` -> `;
      switch (targetNode.type) {
        case "folder":
          displayName += `\x1B[1;34m${targetNode.name}\x1B[0m`;
          break;
        case "shortcut":
          displayName += `\x1B[1;36m${targetNode.name}\x1B[0m`;
          break;
        default:
          displayName += targetNode.name;
      }
      return displayName;
    }
  }

  switch (node.type) {
    case "folder":
      return `\x1B[1;34m${displayName}\x1B[0m`;
    case "shortcut":
      return `\x1B[1;36m${displayName}\x1B[0m`;
    case "app":
      return `\x1B[0m\x1B[32m${displayName}\x1B[0m`;
    default:
      return node.name;
  }
}

function formatPsTime(timestamp: number): string {
  const now = Date.now();

  const elapsedSeconds = Math.floor((now - timestamp) / 1000);

  const hours = Math.floor(elapsedSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((elapsedSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export function formatLsDate(date: Date): string {
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${month} ${day} ${hours}:${minutes}`;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatBytes(kilobytes: number, decimals: number = 1): string {
  if (kilobytes === 0)
    return "0B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["KiB", "MiB", "GiB", "TiB", "PiB"];

  const bytes = kilobytes * 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const index = i < sizes.length ? i : sizes.length - 1;

  const size = sizes[index];
  if (!size) {
    return "0B";
  }

  return Number.parseFloat((bytes / k ** index).toFixed(dm)) + size;
}

function traverseTree(
  node: Node,
  prefix: string,
  isLast: boolean,
  depth: number,
  currentDepth: number,
  lines: string[],
): void {
  if (currentDepth > depth)
    return;

  const connector = isLast ? "└── " : "├── ";

  const line = `${prefix}${connector}${formatNodeName(node)}`;
  lines.push(line);

  if (node.type === "folder" && node.children && node.children.length > 0) {
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

function formatPermissions(type: string, permissions: PermissionsNode): string {
  const permissionString = (perm: PermissionsNode["owner"]) =>
    `${perm.read ? "r" : "-"}${perm.write ? "w" : "-"}${perm.execute ? "x" : "-"}`;

  let typeChar = "-";
  switch (type) {
    case "folder":
      typeChar = "d";
      break;
    case "shortcut":
      typeChar = "l";
      break;
    default:
      break;
  }

  return (
    `${typeChar}${permissionString(permissions.owner)}`
    + `${permissionString(permissions.group)}`
    + `${permissionString(permissions.others)}`
  );
}

function formatFreeRow(
  label: string,
  values: number[],
  humanReadable: boolean,
  widths: number[],
): string {
  const formattedValues = values
    .map((val, idx) => {
      const width = widths[idx] ?? 0;
      if (humanReadable) {
        return formatBytes(val, 1).padStart(width);
      }
      return val.toString().padStart(width);
    })
    .join("  ");

  return `${label.padEnd(6)} ${formattedValues}`;
}

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
  const filesystemWidth = widths[0] ?? 0;
  const sizeWidth = widths[1] ?? 0;
  const usedWidth = widths[2] ?? 0;
  const availWidth = widths[3] ?? 0;
  const usePercentWidth = widths[4] ?? 0;
  const mountedOnWidth = widths[5] ?? 0;
  const filesystemPadded = filesystem.padEnd(filesystemWidth);
  const mountedOnPadded = mountedOn.padEnd(mountedOnWidth);

  const sizeFormatted = humanReadable
    ? formatBytes(Number.parseInt(size) * 1024)
    : size.padStart(sizeWidth);
  const usedFormatted = humanReadable
    ? formatBytes(Number.parseInt(used) * 1024)
    : used.padStart(usedWidth);
  const availFormatted = humanReadable
    ? formatBytes(Number.parseInt(avail) * 1024)
    : avail.padStart(availWidth);
  const usePercentFormatted = usePercent.padStart(usePercentWidth);

  return `${filesystemPadded}  ${sizeFormatted.padStart(sizeWidth)}  ${usedFormatted.padStart(usedWidth)}  ${availFormatted.padStart(availWidth)}  ${usePercentFormatted}  ${mountedOnPadded}`;
}

function formatPsRow(
  pid: number,
  tty: string,
  time: string,
  cmd: string,
  widths: number[],
): string {
  const pidPadded = pid.toString().padStart(widths[0] ?? 0);
  const ttyPadded = tty.padEnd(widths[1] ?? 0);
  const timePadded = time.padEnd(widths[2] ?? 0);
  const cmdPadded = cmd.padEnd(widths[3] ?? 0);
  return `${pidPadded}  ${ttyPadded}  ${timePadded}  ${cmdPadded}`;
}
