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
  isNewlyCreated?: boolean; // Indicates if the node has just been created
  // Permission flags
  canEdit?: boolean;
  canMove?: boolean;
  canDelete?: boolean;
}

export interface AppNode extends FileSystemNode {
  // General
  isOpen?: boolean;
  isActive?: boolean;
  isMinimized?: boolean;
  isFullscreen?: boolean;

  // Size
  width?: number;
  height?: number;

  // Position
  x?: number;
  y?: number;
}

export interface SystemLog {
  ok: boolean;
  action: string;
  message: string;
}