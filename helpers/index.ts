import type { FileSystemNode, Process } from "~/types";
import { defaultFilePermissions, defaultFolderPermissions } from "@/constants";
import { v4 as uuidv4 } from "uuid";
/**
 * Recursively assigns default properties to each node in the file system.
 * @param node The root FileSystemNode.
 * @returns A new FileSystemNode with default properties assigned to itself and all descendants.
 */
export const assignDefaultProperties = (
  node: FileSystemNode,
  username: string,
): FileSystemNode => {
  const createdAt = Intl.DateTimeFormat("it-IT", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

  // Create new node with default properties
  const newNode: FileSystemNode = {
    ...node,
    id: node.id || uuidv4(),
    permissions:
      node.permissions || node.type === "folder"
        ? defaultFolderPermissions
        : defaultFilePermissions,
    owner: node.owner || username,
    group: node.group || username,
    createdAt: node.createdAt || createdAt,
    content: node.content || "",
  };

  // Recursively process children
  if (newNode.children && newNode.children.length > 0) {
    newNode.children = newNode.children.map((child) =>
      assignDefaultProperties(child, username),
    );
  }

  return newNode;
};

/**
 * Resolves a given path starting from a specified directory node.
 * @param fileSystem The root FileSystemNode.
 * @param currentDirectoryNode The node from which to start resolving the path.
 * @param path The path to resolve (absolute or relative).
 * @returns The FileSystemNode corresponding to the path, or null if not found.
 */
export function resolvePath(
  fileSystem: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
  path: string,
): FileSystemNode | null {
  if (!path) return null;

  // Determine if the path is absolute
  const isAbsolute = path.startsWith("/");

  // Split the path into parts, ignoring empty segments
  const parts = path.split("/").filter((part) => part.length > 0);

  // Start from root if absolute, else from current directory
  let node: FileSystemNode = isAbsolute ? fileSystem : currentDirectoryNode;

  for (const part of parts) {
    if (part === ".") {
      continue; // Current directory, no change
    } else if (part === "..") {
      // Parent directory handling requires parent references
      // Since our FileSystemNode does not have a parent reference, we cannot traverse up
      // Thus, return null or handle accordingly
      return null; // Unable to navigate to parent
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
 * @param root The root FileSystemNode of the file system.
 * @param currentDirectoryNode The current directory FileSystemNode.
 * @param path The path to validate.
 * @returns True if the path is valid, false otherwise.
 */
export const isPathValid = (
  root: FileSystemNode,
  currentDirectoryNode: FileSystemNode,
  path: string,
): boolean => {
  return !!resolvePath(root, currentDirectoryNode, path);
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
 * Recursively finds a node based on the provided path segments.
 * @param node The current FileSystemNode.
 * @param pathSegments The remaining segments of the path.
 * @returns The FileSystemNode if found, otherwise null.
 */
export const findNodeByPath = (
  node: FileSystemNode,
  pathSegments: string[],
): FileSystemNode | null => {
  if (pathSegments.length === 0) {
    return node;
  }

  const [currentSegment, ...remainingSegments] = pathSegments;

  if (!node.children || node.type !== "folder") {
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
 * @param root The root FileSystemNode.
 * @param path The absolute path string (e.g., "/home/user/Desktop").
 * @returns The FileSystemNode if found, otherwise null.
 */
export const findNodeByAbsolutePath = (
  root: FileSystemNode,
  path: string,
): FileSystemNode | null => {
  if (path === "/") {
    return root;
  }

  const pathSegments = splitPath(path);
  return findNodeByPath(root, pathSegments);
};

/**
 * Recursively finds a node by its ID.
 * @param node The current FileSystemNode.
 * @param id The ID to search for.
 * @returns The FileSystemNode if found, otherwise null.
 */
export const findNodeByIdRecursive = (
  node: FileSystemNode,
  id: string,
): FileSystemNode | null => {
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
 * Finds the parent of a node by the child's ID.
 * @param node The current FileSystemNode.
 * @param childId The ID of the child node.
 * @returns The parent FileSystemNode if found, otherwise null.
 */
export const findParentById = (
  node: FileSystemNode,
  childId: string,
): FileSystemNode | null => {
  if (node.type !== "folder" || !node.children) return null;

  for (const child of node.children) {
    if (child.id === childId) {
      return node;
    }
    if (child.type === "folder") {
      const result = findParentById(child, childId);
      if (result) return result;
    }
  }
  return null;
};

/**
 * Gets the full path of a node by traversing up to the root.
 * @param root Optional root node to traverse up to. If not provided, traverses to filesystem root.
 * @param node The FileSystemNode to get the path for.
 * @returns The full path as a string, starting with '/'.
 */
export const getNodeFullPath = (
  root: FileSystemNode,
  node: FileSystemNode,
): string => {
  const pathParts: string[] = [];
  let current = node;

  while (current) {
    // Stop if we've reached the provided root node
    if (current.id === root.id) {
      pathParts.unshift(current.name); // Include the root name
      break;
    }

    pathParts.unshift(current.name); // Add the current node's name to the path
    const parent = findParentById(root, current.id); // Pass the root to search within the entire structure
    current = parent!;
  }

  const path = `/${pathParts.slice(1).join("/")}`;

  return path;
};

/**
 * Determines if a node can be moved.
 * @param node The FileSystemNode to check.
 * @returns True if movable, else false.
 */
export const canMove = (node: FileSystemNode): boolean => {
  return node.canMove !== false;
};

/**
 * Determines if a node can be edited.
 * @param node The FileSystemNode to check.
 * @returns True if editable, else false.
 */
export const canEdit = (node: FileSystemNode): boolean => {
  return node.canEdit !== false;
};

/**
 * Determines if a node can be deleted.
 * @param node The FileSystemNode to check.
 * @returns True if deletable, else false.
 */
export const canDelete = (node: FileSystemNode): boolean => {
  return node.canDelete !== false;
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
