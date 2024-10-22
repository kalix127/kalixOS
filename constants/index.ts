// @ts-nocheck
import type { WifiNetwork, FileSystemNode, SystemLog } from "@/types";
import { assignIds } from "~/helpers";

export const defaultNetworks: WifiNetwork[] = [
  { id: 1, name: "FASTWEB-7632798", signal: 4, isProtected: true },
  { id: 2, name: "TIM-1234567", signal: 3, isProtected: true },
  { id: 3, name: "ILIAD-34781 Public", signal: 1, isProtected: false },
];

export const defaultFileSystem = (username: string): FileSystemNode =>
  assignIds({
    name: "/",
    type: "folder",
    canMove: false,
    canDelete: false,
    icon: "folder:folder",
    children: [
      {
        name: "home",
        type: "folder",
        canMove: false,
        canDelete: false,
        icon: "folder:folder",
        children: [
          {
            name: username,
            type: "folder",
            canMove: false,
            canDelete: false,
            icon: "folder:folder",
            children: [
              {
                name: "Downloads",
                type: "folder",
                icon: "folder:folder",
                children: [],
              },
              {
                name: "Documents",
                type: "folder",
                icon: "folder:folder",
                children: [],
              },
              {
                name: "Pictures",
                type: "folder",
                icon: "folder:folder",
                children: [],
              },
              {
                name: "Music",
                type: "folder",
                icon: "folder:folder",
                children: [],
              },
              {
                name: "Videos",
                type: "folder",
                icon: "folder:folder",
                children: [],
              },
              {
                name: "Desktop",
                type: "folder",
                icon: "folder:folder",
                canMove: false,
                canDelete: false,
                children: [
                  {
                    name: "Trash",
                    type: "app",
                    canMove: false,
                    canDelete: false,
                    icon: "app:trash",
                    children: [],
                  },
                ],
              },
              {
                name: ".zshrc",
                type: "file",
                icon: "file:text",
              },
            ],
          },
        ],
      },
      {
        name: "bin",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
      {
        name: "etc",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
      {
        name: "proc",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
      {
        name: "run",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
      {
        name: "usr",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
      {
        name: "var",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
      {
        name: "tmp",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
    ],
  });


// TODO: Add more defaults apps without any functionality
export const defaultDockApps: FileSystemNode[] = [
  {
    name: "Settings",
    type: "app",
    icon: "app:settings",
    id: "settings-app",
  },
  {
    name: "Files",
    type: "app",
    icon: "app:files",
    id: "files-app",
  },
  {
    name: "Terminal",
    type: "app",
    icon: "app:terminal",
    id: "terminal-app",
  },
  {
    name: "Brave",
    type: "app",
    icon: "app:brave",
    id: "brave-app",
  },
  {
    name: "Thunderbird",
    type: "app",
    icon: "app:thunderbird",
    id: "thunderbird-app",
  },
  {
    name: "Visual Studio Code",
    type: "app",
    icon: "app:vscode",
    id: "vscode-app",
  },
  {
    name: "Kate",
    type: "app",
    icon: "app:kate",
    id: "kate-app",
  },
];

export const defaultBootDuration = 5000;

export const powerUpSystemLogs: SystemLog[] = [];

export const powerOffSystemLogs: SystemLog[] = [
  {
    ok: true,
    action: "Unmounted",
    message: "/run/user/120.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Permit User Session.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "Network.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "Remote File System.",
  },
  {
    action: "Stopping",
    message: "WPA supplicant...",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Optimus Manager Commands Daemon.",
  },
  {
    ok: true,
    action: "Started",
    message: "Show Plymouth Power Off Screen.",
  },
  {
    ok: true,
    action: "Finished",
    message: "Generate shutdown-ramfs.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "User Runtime Directory /run/user/120.",
  },
  {
    ok: true,
    action: "Removed slice",
    message: "User Slice of UID 120.",
  },
  {
    action: "Starting",
    message: "Tell Plymouth To Jump To initramfs...",
  },
  {
    action: "Stopping",
    message: "User Login Management...",
  },
  { ok: true, action: "Stopped", message: "WPA suppllicant." },
  {
    ok: true,
    action: "Finished",
    message: "Tell Plymouth To Jump To initramfs.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "User Login Management.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "User and Group Name Lookups.",
  },
  {
    action: "Stopping",
    message: "Network Manager...",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Network Manager.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "Basic System.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Forward Password Requests to Plymouth Directory Watch.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "Path Units.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "Slice Units.",
  },
  {
    ok: true,
    action: "Removed slice",
    message: "User and Session Slice.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "Socket Units.",
  },
  {
    ok: true,
    action: "Removed slice",
    message: "Slice /system/dirmngr.",
  },
  {
    ok: true,
    action: "Closed",
    message: "Docker Socket for the API.",
  },
  {
    ok: true,
    action: "Removed slice",
    message: "/system/gpg-agent-browser.",
  },
  {
    ok: true,
    action: "Removed slice",
    message: "/system/gpg-agent-extra.",
  },
  {
    ok: true,
    action: "Removed slice",
    message: "/system/gpg-agent-ssh.",
  },
  {
    ok: true,
    action: "Removed slice",
    message: "/system/gpg-agent.",
  },
  {
    ok: true,
    action: "Removed slice",
    message: "/system/keyboxd.",
  },
  {
    ok: true,
    action: "Closed",
    message: "Socket activation for snappy daemon.",
  },
  {
    ok: true,
    action: "Closed",
    message: "OpenSSH Server Socket (systemd-ssh-generator, AP_UNIX Local).",
  },
  {
    ok: true,
    action: "Closed",
    message: "Hostname Service Socket.",
  },
  {
    action: "Stopping",
    message: "D-Bus System Message Bus...",
  },
  {
    ok: true,
    action: "Stopped",
    message: "D-Bus System Message Bus.",
  },
  {
    ok: true,
    action: "Closed",
    message: "D-Bus System Message BusSocket.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "System Initialization.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Local Encrypted Volumes.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Forward Password Requests to Wall Directory Watch.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "Local Integrity Protected Volumes.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Local Verity Protected Volumes.",
  },
  {
    action: "Stopping",
    message: "Set Up Additional Binary Formats...",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Apply Kernel Variables.",
  },
  {
    ok: true,
    action: "Closed",
    message: "Process Core Dump Socket.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Load Kernel Modules.",
  },
  {
    action: "Stopping",
    message: "Network Time Synchronization...",
  },
  {
    action: "Stopping",
    message: "Record System Boot/Shutdown in UTMP...",
  },

  {
    ok: true,
    action: "Stopped",
    message: "Set Up Additional Binary Formats.",
  },
  {
    ok: true,
    action: "Unset automount",
    message: "Arbitrary Executable File Format File System Automount Point.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Record System Boot/Shutdown in UTMP.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Network Time Synchronization.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Create System Files and Directories.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "Local File Systems.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "Mounted snaps.",
  },
  {
    action: "Unmounting",
    message: "/boot/efi...",
  },
  {
    action: "Unmounting",
    message: "/tmp...",
  },
  {
    action: "Unmounting",
    message: "Mount unit for bare, revision 5...",
  },
  {
    action: "Unmounting",
    message: "Mount unit for core18, revision 2829...",
  },
  {
    action: "Unmounting",
    message: "Mount unit for core18, revision 2846...",
  },
  {
    action: "Unmounting",
    message: "Mount unit for core20, revision 2379...",
  },
  {
    action: "Unmounting",
    message: "Mount unit for core22, revision 1612...",
  },
  {
    action: "Unmounting",
    message: "Mount unit for core22, revision 1621...",
  },
  {
    action: "Unmounting",
    message: "Mount unit for cups, revision 1050...",
  },
  {
    action: "Unmounting",
    message: "Mount unit for gtk-common-themes, revision 1535...",
  },
  {
    action: "Unmounting",
    message: "Mount unit for notion, revision 46...",
  },
  {
    action: "Unmounting",
    message: "Mount unit for notion, revision 47...",
  },
  {
    action: "Unmounting",
    message: "Mount unit for snapd, revision 21759...",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "/tmp.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "Mount unit for bare, revision 5.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "Mount unit for core18, revision 2829.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "Mount unit for core18, revision 2846.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "Mount unit for core20, revision 2379.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "Mount unit for core22, revision 1612.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "Mount unit for core22, revision 1621.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "Mount unit for cups, revision 1050.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "Mount unit for gtk-common-themes, revision 1535.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "Mount unit for notion, revision 46.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "Mount unit for notion, revision 47.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "Mount unit for snapd, revision 21759.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "Mounting snaps.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Mounting snaps.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "/boot/efi.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "Mount unit for bare, revision 5.",
  },
  {
    ok: true,
    action: "Removed slice",
    message: "Slice /system/systemd-fsck.",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "/run/snapd/ns/cups.mnt.",
  },
  {
    action: "Unmounting",
    message: "/run/snapd/ns...",
  },
  {
    ok: true,
    action: "Unmounted",
    message: "/run/snapd/ns.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "Preparation for Local File Systems.",
  },
  {
    ok: true,
    action: "Stopped target",
    message: "Swaps.",
  },
  {
    ok: true,
    action: "Reached target",
    message: "Unmount All Filesystems.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Remount Root and Kernel File Systems.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Create Statis Device Nodes in /dev.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Create Static Device Nodes in /dev gracefully.",
  },
  {
    ok: true,
    action: "Reached target",
    message: "System Shutdown.",
  },
  {
    ok: true,
    action: "Reached target",
    message: "Late Shutdown Services.",
  },
  {
    ok: true,
    action: "Finished",
    message: "System Power Off.",
  },
  {
    ok: true,
    action: "Reached target",
    message: "System Power Off.",
  },
];
