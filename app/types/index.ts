export interface WifiNetwork {
  id: number;
  name: string;
  signal: number;
  isProtected: boolean;
}

export type NodeType = "folder" | "file" | "app" | "shortcut";

interface PermissionBits {
  read: boolean;
  write: boolean;
  execute: boolean;
};

export interface PermissionsNode {
  owner: PermissionBits;
  group: PermissionBits;
  others: PermissionBits;
}

interface BaseNode {
  id: string;
  name: string;
  icon: string;
  type: NodeType;
  permissions: PermissionsNode;
  owner: string;
  group: string;
  createdAt: Date;
  content?: string;
  parentId?: string | null;
  isProtected?: boolean;
  isRenaming?: boolean;
  isTranslated?: boolean;
}

export interface FolderNode extends BaseNode {
  type: "folder";
  children: Node[];
}

export interface FileNode extends BaseNode {
  type: "file";
}

export interface AppNode extends BaseNode {
  type: "app";
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isFullscreen: boolean;
  isDropdownOpen: boolean;
  isActive: boolean;
}

export interface ShortcutNode extends BaseNode {
  type: "shortcut";
  targetId: string;
  targetType: Exclude<NodeType, "shortcut">;
}

export type ContextMenuTargetType
  = | "desktop"
    | "dock"
    | "folder"
    | "file"
    | "app"
    | "shortcut";

export type Node = FolderNode | FileNode | AppNode | ShortcutNode;

export interface NodeSeed {
  id?: string;
  name: string;
  icon: string;
  type: NodeType;
  permissions?: PermissionsNode;
  owner?: string;
  group?: string;
  createdAt?: Date;
  content?: string;
  parentId?: string | null;
  isProtected?: boolean;
  isRenaming?: boolean;
  isTranslated?: boolean;
  children?: NodeSeed[];
  title?: string;
  isOpen?: boolean;
  isMinimized?: boolean;
  isFullscreen?: boolean;
  isDropdownOpen?: boolean;
  isActive?: boolean;
  targetId?: string;
  targetType?: Exclude<NodeType, "shortcut">;
}

export interface SystemLog {
  ok?: boolean;
  action?: string;
  message: string;
}

export interface BackgroundImage {
  url: string;
  name: string;
}

export interface Process {
  pid: number;
  appId: string;
  startTimeTimestamp: number;
  command: string;
}

export interface PositionalArg {
  name: string;
  required: boolean;
}

export interface CommandSpec {
  acceptsFlags: string[];
  flagAliases: { [alias: string]: string };
  flagsWithValues?: string[];
  positionalArgs: PositionalArg[];
}

export interface ParsedArgs {
  flags: string[];
  flagValues: { [key: string]: string };
  positionalArgs: string[];
}
export interface Notification {
  id: string;
  title: string;
  description: string;
  icon: string;
  isTranslated: boolean;
}
