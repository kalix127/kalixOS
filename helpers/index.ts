import type { FileSystemNode } from "~/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Recursively assigns unique IDs to each node in the file system.
 * @param node The root FileSystemNode.
 * @returns A new FileSystemNode with unique IDs assigned to itself and all its descendants.
 */
export const assignIds = (node: FileSystemNode): FileSystemNode => {
  const newNode: FileSystemNode = {
    ...node,
    id: uuidv4(),
  };

  if (newNode.children && newNode.children.length > 0) {
    newNode.children = newNode.children.map((child) => assignIds(child));
  }

  return newNode;
};

/**
 * Splits a UNIX-like path into its components.
 * @param path The path string (e.g., "/home/user/Desktop").
 * @returns An array of path segments.
 */
const splitPath = (path: string): string[] => {
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
