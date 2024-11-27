import type { FolderNode, Node, PermissionsNode, Process } from "~/types";
import { defaultFilePermissions, defaultFolderPermissions } from "@/constants";
import { v4 as uuidv4 } from "uuid";

export const assignDefaultProperties = (
  node: Node,
  username: string,
  parentId: string | null = null,
): Node => {
  const createdAt = new Date();

  const newNode: Node = {
    ...node,
    id: node.id || uuidv4(),
    permissions: node.permissions || defaultPermissionsForType(node.type),
    owner: node.owner || username.toLowerCase(),
    group: node.group || username.toLowerCase(),
    createdAt: node.createdAt || createdAt,
    parentId: parentId,
  };

  // Assign children for folders
  if (newNode.type === "folder") {
    (newNode as FolderNode).children = (node as FolderNode).children || [];
  }

  // Assign content for files
  if (newNode.type === "file") {
    newNode.content = node.content || "";
  }

  // Recursively assign default properties for every children
  if (
    newNode.type === "folder" &&
    newNode.children &&
    newNode.children.length > 0
  ) {
    newNode.children = newNode.children.map((child) =>
      assignDefaultProperties(child, username.toLowerCase(), newNode.id),
    );
  }

  return newNode;
};

export function defaultPermissionsForType(type: string): PermissionsNode {
  switch (type) {
    case "folder":
      return defaultFolderPermissions;
    case "file":
    case "shortcut":
      return defaultFilePermissions;
    case "app":
      return defaultFilePermissions; // Adjust as needed
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
  if (!path) return null;

  const isAbsolute = path.startsWith("/");

  const parts = path.split("/").filter((part) => part.length > 0);

  let node: Node = isAbsolute ? fileSystem : currentDirectoryNode;

  for (const part of parts) {
    if (part === ".") {
      continue; // Current directory, no change
    } else if (part === "..") {
      if (node.parentId) {
        const parentNode = findNodeByIdRecursive(fileSystem, node.parentId);
        if (parentNode) {
          node = parentNode;
        } else {
          // Parent node not found
          return null;
        }
      } else {
        // Already at root
        return null;
      }
    } else {
      if (node.type !== "folder" || !node.children) {
        return null; // Cannot traverse further
      }

      const found = node.children.find((child) => child.name === part);
      if (found) {
        node = found;
      } else {
        return null; // Path does not exist
      }
    }
  }

  return node;
}

/**
 * Checks if a given path is valid in the file system.
 * @param nodeMap The Map of node IDs to Nodes.
 * @param root The root Node of the file system.
 * @param currentDirectoryNode The current directory Node.
 * @param path The path to validate.
 * @returns True if the path is valid, false otherwise.
 */
export const isPathValid = (
  root: Node,
  currentDirectoryNode: Node,
  path: string,
): boolean => {
  return !!resolvePath(root, currentDirectoryNode, path);
};

/**
 * Recursively finds a node by its ID starting from a node.
 * @param node The current Node.
 * @param id The ID to search for.
 * @returns The Node if found, otherwise null.
 */
export const findNodeByIdRecursive = (node: Node, id: string): Node | null => {
  if (node.id === id) return node;
  if (node.type === "folder" && node.children) {
    for (const child of node.children) {
      const result = findNodeByIdRecursive(child, id);
      if (result) return result;
    }
  }
  return null;
};

/**
 * Finds a node based on the provided path segments.
 * @param node The current Node.
 * @param pathSegments The remaining segments of the path.
 * @returns The Node if found, otherwise null.
 */
export const findNodeByPath = (
  node: Node,
  pathSegments: string[],
): Node | null => {
  if (pathSegments.length === 0) {
    return node;
  }

  const [currentSegment, ...remainingSegments] = pathSegments;

  if (node.type !== "folder" || !node.children) {
    return null;
  }

  const child = node.children.find((child) => child.name === currentSegment);
  if (!child) {
    return null;
  }

  return findNodeByPath(child, remainingSegments);
};

/**
 * Finds a node by its absolute path.
 * @param root The root Node.
 * @param path The absolute path string (e.g., "/home/user/Desktop").
 * @returns The Node if found, otherwise null.
 */
export const findNodeByAbsolutePath = (
  root: Node,
  path: string,
): Node | null => {
  if (path === "/") {
    return root;
  }

  const pathSegments = splitPath(path);
  return findNodeByPath(root, pathSegments);
};

/**
 * Gets the full path of a node by traversing up to the root.
 * @param nodeMap The Map of node IDs to Nodes.
 * @param root The root Node to traverse up to.
 * @param node The Node to get the path for.
 * @returns The full path as a string, starting with '/'.
 */
export const getNodeFullPath = (root: Node, node: Node): string => {
  const pathParts: string[] = [];
  let current: Node | null = node;

  while (current) {
    if (current === root) {
      pathParts.unshift(current.name);
      break;
    }

    pathParts.unshift(current.name);
    if (current.parentId) {
      current = findNodeByIdRecursive(root, current.parentId);
    } else {
      current = null;
    }
  }

  return `/${pathParts.slice(1).join("/")}`;
};

/**
 * Splits a UNIX-like path into its components.
 * @param path The path string (e.g., "/home/user/Desktop").
 * @returns An array of path segments.
 */
export const splitPath = (path: string): string[] => {
  return path.split("/").filter((segment) => segment.length > 0);
};

/**
 * Gets the appropriate icon for a file based on its extension.
 * @param extension The file extension (without the dot).
 * @returns A string representing the icon name.
 */
export const getNodeIcon = (extension: string): string => {
  switch (extension.toLowerCase()) {
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
};

export const getNextPid = (processes: Process[]): number => {
  const highestPid = processes.reduce(
    (max, process) => Math.max(max, process.pid),
    0,
  );
  const randomIncrement = Math.floor(Math.random() * 500) + 1;
  return highestPid + randomIncrement;
};
