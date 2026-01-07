import type { Node, NodeSeed, NodeType, PermissionsNode, Process } from "@/types";
import { v4 as uuidv4 } from "uuid";
import {
  defaultAppPermissions,
  defaultFilePermissions,
  defaultFolderPermissions,
  defaultShortcutPermissions,
} from "@/constants";

export function assignDefaultProperties(node: NodeSeed, username: string, parentId: string | null = null): Node {
  const createdAt = new Date();

  const newNode: Node = {
    ...node,
    id: node.id || uuidv4(),
    permissions: node.permissions || defaultPermissionsForType(node.type),
    owner: node.owner || username.toLowerCase(),
    group: node.group || username.toLowerCase(),
    createdAt: node.createdAt || createdAt,
    parentId,
  } as Node;

  if (newNode.type === "folder") {
    const seedChildren = node.type === "folder" ? node.children || [] : [];
    newNode.children = seedChildren.map(child =>
      assignDefaultProperties(child, username.toLowerCase(), newNode.id),
    );
  }

  if (newNode.type === "file") {
    newNode.content = node.content || "";
  }

  return newNode;
}

export function defaultPermissionsForType(type: NodeType): PermissionsNode {
  switch (type) {
    case "folder":
      return defaultFolderPermissions;
    case "shortcut":
      return defaultShortcutPermissions;
    case "app":
      return defaultAppPermissions;
    case "file":
    default:
      return defaultFilePermissions;
  }
}

/* Paths */

/**
 * Resolves a given path starting from a specified directory node.
 * @param fileSystem The root Node.
 * @param currentDirectoryNode The node from which to start resolving the path.
 * @param path The path to resolve (absolute or relative).
 * @returns The Node corresponding to the path, or null if not found.
 */
export function resolvePath(
  fileSystem: Node,
  currentDirectoryNode: Node,
  path: string,
): Node | null {
  if (!path)
    return null;

  const isAbsolute = path.startsWith("/");

  const parts = path.split("/").filter(part => part.length > 0);

  let node: Node = isAbsolute ? fileSystem : currentDirectoryNode;

  for (const part of parts) {
    if (part === ".") {
      continue;
    } else if (part === "..") {
      if (node.parentId) {
        const parentNode = findNodeByIdRecursive(fileSystem, node.parentId);
        if (parentNode) {
          node = parentNode;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      if (node.type !== "folder" || !node.children) {
        return null;
      }

      const found = node.children.find(child => child.name === part);
      if (found) {
        node = found;
      } else {
        return null;
      }
    }
  }

  return node;
}

export function isPathValid(root: Node, currentDirectoryNode: Node, path: string): boolean {
  return !!resolvePath(root, currentDirectoryNode, path);
}

export function findNodeByIdRecursive(node: Node, id: string): Node | null {
  if (node.id === id)
    return node;
  if (node.type === "folder" && node.children) {
    for (const child of node.children) {
      const result = findNodeByIdRecursive(child, id);
      if (result)
        return result;
    }
  }
  return null;
}

export function findNodeByPath(node: Node, pathSegments: string[]): Node | null {
  if (pathSegments.length === 0) {
    return node;
  }

  const [currentSegment, ...remainingSegments] = pathSegments;

  if (node.type !== "folder" || !node.children) {
    return null;
  }

  const child = node.children.find(child => child.name === currentSegment);
  if (!child) {
    return null;
  }

  return findNodeByPath(child, remainingSegments);
}

export function findNodeByAbsolutePath(root: Node, path: string): Node | null {
  if (path === "/") {
    return root;
  }

  const pathSegments = splitPath(path);
  return findNodeByPath(root, pathSegments);
}

export function getNodeFullPath(root: Node, node: Node): { absolutePath: string; nodes: Node[] } {
  const pathParts: string[] = [];
  const nodes: Node[] = [];
  let current: Node | null = node;

  while (current) {
    if (current === root) {
      pathParts.unshift(current.name);
      nodes.unshift(current);
      break;
    }

    pathParts.unshift(current.name);
    nodes.unshift(current);
    if (current.parentId) {
      current = findNodeByIdRecursive(root, current.parentId);
    } else {
      current = null;
    }
  }

  return {
    absolutePath: `/${pathParts.slice(1).join("/")}`,
    nodes: nodes.slice(1),
  };
}

export function splitPath(path: string): string[] {
  return path.split("/").filter(segment => segment.length > 0);
}

export function getNodeIcon(type: string, name: string): string {
  if (type === "folder") {
    return "folder:folder";
  }

  if (type === "file") {
    const extension = name.split(".").pop()?.toLowerCase() || "";
    switch (extension) {
      case "css":
        return "file:css";
      case "js":
        return "file:javascript";
      case "html":
        return "file:html";
      case "json":
        return "file:json";
      case "md":
        return "file:markdown";
      case "txt":
        return "file:text";
      case "py":
        return "file:python";
      case "java":
        return "file:java";
      case "vue":
        return "file:vue";
      case "deb":
        return "file:deb";
      case "sh":
        return "file:bash";
      case "pdf":
        return "file:pdf";
      case "doc":
      case "docx":
        return "file:docx";
      case "xlsx":
        return "file:xlsx";
      case "mp3":
      case "wav":
        return "file:audio";
      case "mp4":
      case "mov":
        return "file:video";
      case "png":
      case "jpg":
      case "jpeg":
      case "bmp":
        return "file:image";
      case "zip":
      case "rar":
      case "tar":
      case "7z":
        return "file:archive";
      case "pem":
      case "crt":
      case "key":
        return "file:certificate";
      case "enc":
        return "file:encrypt";
      case "bin":
        return "file:bin";
      default:
        return "file:file";
    }
  }

  return "file:file";
}

export function getNextPid(processes: Process[]): number {
  const highestPid = processes.reduce(
    (max, process) => Math.max(max, process.pid),
    0,
  );
  const randomIncrement = Math.floor(Math.random() * 500) + 1;
  return highestPid + randomIncrement;
}

export function formatNodeSize(chars: number, decimals: number = 1): string {
  if (chars === 0)
    return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];

  const i = Math.floor(Math.log(chars) / Math.log(k));
  const index = i < sizes.length ? i : sizes.length - 1;

  return (
    `${Number.parseFloat((chars / k ** index).toFixed(dm))} ${sizes[index]}`
  );
}

export function generateRandomDelays(
  count: number,
  totalTime: number,
): number[] {
  const randomNumbers = Array.from({ length: count }, () => Math.random());
  const sumOfRandoms = randomNumbers.reduce((acc, num) => acc + num, 0);
  return randomNumbers.map(random => (random / sumOfRandoms) * totalTime);
}
