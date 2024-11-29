#!/bin/bash
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

interface BaseNode {
  id: string;
  name: string;
  icon: string;
  type: string;
  permissions: PermissionsNode;
  owner: string;
  group: string;
  createdAt: Date;
  content?: string;
  parentId?: string | null;
  isProtected?: boolean;
  isRenaming?: boolean;
  isTranslated?: boolean;
  isNewlyCreated?: boolean;
}

export interface PermissionsNode {
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  others: { read: boolean; write: boolean; execute: boolean };
}

export interface FolderNode extends BaseNode {
  type: "folder";
  children: Node[];
}

export interface FileNode extends BaseNode {
  type: "file";
}

export interface AppNode extends BaseNode {
  type: "app" | "social";
  isOpen: boolean;
  isActive: boolean;
  isMinimized: boolean;
  isFullscreen: boolean;
  isModalOpen: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
  prev: { width: number; height: number; x: number; y: number };
}

export interface ShortcutNode extends BaseNode {
  type: "shortcut";
  targetId: string;
  targetType: "app" | "folder" | "file";
}

export type ContextMenuTargetType =
  | "desktop"
  | "social"
  | "dock"
  | "folder"
  | "file"
  | "app"
  | "shortcut";

// Union type for all node types
export type Node = FolderNode | FileNode | AppNode | ShortcutNode;

export interface SystemLog {
  ok: boolean;
  action: string;
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

export interface CommandSpec {
  acceptsFlags: string[];
  flagAliases: { [alias: string]: string };
  flagsWithValues?: string[];
  positionalArgs?: { name: string; required: boolean }[];
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
  iconSize?: number;
}
