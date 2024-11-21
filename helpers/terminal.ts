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
  return node.type === "folder" ? `\x1b[1;34m${node.name}/\x1b[0m` : node.name;
}
