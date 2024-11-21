import { Terminal } from "@xterm/xterm";
import type { FileSystemNode } from "~/types";
import {
  findNodeByAbsolutePath,
  findParentById,
  splitPath,
  findNodeByPath,
  resolvePath,
} from "~/helpers";

const { editItem } = useDesktopStore();
const { setCurrentDirectory } = useTerminalStore();

export function handleCd(
  term: Terminal,
  args: string[],
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
  homeDirectoryNode: FileSystemNode,
): void {
  const toDir = args[1];
  if (!toDir) {
    setCurrentDirectory(homeDirectoryNode);
    return;
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
    return;
  }

  setCurrentDirectory(targetNode);
}

export function handleLs(
  term: Terminal,
  args: string[],
  currentDirectoryNode: FileSystemNode,
): void {
  const flags = args.filter((arg) => arg.startsWith("-"));
  const nodes = currentDirectoryNode.children ?? [];

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

      // Convert permissions object to rwxr-xr-x format
      const formatPermissions = (
        permissions: FileSystemNode["permissions"],
      ) => {
        const permissionString = (perm: {
          read: boolean;
          write: boolean;
          execute: boolean;
        }) =>
          `${perm.read ? "r" : "-"}${perm.write ? "w" : "-"}${perm.execute ? "x" : "-"}`;

        return (
          `${permissionString(permissions?.owner ?? { read: false, write: false, execute: false })}` +
          `${permissionString(permissions?.group ?? { read: false, write: false, execute: false })}` +
          `${permissionString(permissions?.others ?? { read: false, write: false, execute: false })}`
        );
      };

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
    return;
  }

  // If a path is provided, show the contents of the path
  if (args.length > 1) {
    const path = args[1];
    const pathNode = findNodeByPath(currentDirectoryNode, splitPath(path));

    if (!pathNode) {
      term.write(`\r\nls: cannot access '${path}': No such file or directory`);
      return;
    }

    const output = pathNode.children
      ?.map((node) => formatNodeName(node))
      .join("  ");

    if (output?.trim() !== "") term.write(`\r\n${output}`);
    return;
  }

  // If no flags or paths are provided, show simple list format
  const output = nodes.map((node) => formatNodeName(node)).join("  ");
  if (output) {
    term.write(`\r\n${output}`);
  }
}

export function formatNodeName(node: FileSystemNode): string {
  return node.type === "folder"
    ? `\x1b[1;34m${node.name}\x1b[0m`
    : node.name;
}

export function handleChown(
  term: Terminal,
  args: string[],
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
): void {
  if (!args[1]) {
    term.write(`\r\nchown: missing operand`);
    return;
  }

  const [user, group] = args[1].split(":");
  if (!user || !group) {
    term.write(`\r\nchown: invalid format; expected 'user:group'`);
    return;
  }

  const targetPath = args[2];
  if (!targetPath) {
    term.write(`\r\nchown: missing file operand`);
    return;
  }

  const targetNode = resolvePath(fileSystem, currentDirectoryNode, targetPath);
  if (!targetNode) {
    term.write(
      `\r\nchown: cannot access '${targetPath}': No such file or directory`,
    );
    return;
  }

  editItem(targetNode.id, { owner: user, group });
}

export function handleChmod(
  term: Terminal,
  args: string[],
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
): void {
  if (!args[1]) {
    term.write("\r\nchmod: missing operand");
    return;
  }

  const mode = args[1];
  const targetPath = args[2];
  if (!targetPath) {
    term.write("\r\nchmod: missing file operand");
    return;
  }

  const targetNode = resolvePath(fileSystem, currentDirectoryNode, targetPath);
  if (!targetNode) {
    term.write(
      `\r\nchmod: cannot access '${targetPath}': No such file or directory`,
    );
    return;
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
    term.write(`\r\nPermissions of '${targetNode.name}' updated successfully`);
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
  } else {
    term.write(`\r\nchmod: invalid mode: '${mode}'`);
  }
}
