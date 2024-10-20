export interface WifiNetwork {
  id: number;
  name: string;
  signal: number;
  isProtected: boolean;
}

export interface FileSystemNode {
  id: string;
  icon: string;
  name: string;
  type: "folder" | "file" | "app";
  children?: FileSystemNode[];
  isRenaming?: boolean;
  // Permission flags
  canEdit?: boolean;
  canMove?: boolean;
  canDelete?: boolean;
}