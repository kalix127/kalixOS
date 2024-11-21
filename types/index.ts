export interface WifiNetwork {
  id: number;
  name: string;
  signal: number;
  isProtected: boolean;

  isSaved?: boolean;
  details?: {
    linkSpeed: string;
    security: string;
    ipv4: string;
    ipv6: string;
    hardwareAddress: string;
    supportedFrequencies: string[];
    defaultRoute: string;
    dns4: string[];
    dns6: string[];
  };
}

export interface FileSystemNode {
  id: string;
  icon: string;
  name: string;
  type: "folder" | "file" | "app" | "social";
  children?: (FileSystemNode | AppNode)[];
  isRenaming?: boolean;
  isNewlyCreated?: boolean; // Indicates if the node has just been created
  content?: string;
  owner?: string;
  group?: string;
  createdAt?: string;
  permissions: {
    owner: {
      read: boolean;
      write: boolean;
      execute: boolean;
    };
    group: {
      read: boolean;
      write: boolean;
      execute: boolean;
    };
    others: {
      read: boolean;
      write: boolean;
      execute: boolean;
    };
  };
  canEdit?: boolean;
  canMove?: boolean;
  canDelete?: boolean;
}

export interface AppNode extends FileSystemNode {
  // General
  isOpen: boolean;
  isActive: boolean;
  isMinimized: boolean;
  isFullscreen: boolean;
  isModalOpen: boolean;
  isTranslated?: boolean;

  // Size
  width: number;
  height: number;

  // Position
  x: number;
  y: number;

  prev: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
}

export interface SystemLog {
  ok: boolean;
  action: string;
  message: string;
}

export interface BackgroundImage {
  url: string;
  name: string;
}
