// @ts-nocheck
import type { WifiNetwork, FileSystemNode, SystemLog, AppNode } from "@/types";
import { assignIds } from "~/helpers";

export const defaultBootDuration = 5000;

export const defaultSuspendThreshold = 300000; // 5 minutes

export const desktopEnvironments = [
  "GNOME",
  "GNOME Classic",
  "GNOME Classic on Xorg",
  "GNOME on Xorg",
];

export const defaultNetworks: WifiNetwork[] = [
  { id: 1, name: "FASTWEB-7632798", signal: 4, isProtected: true },
  { id: 2, name: "TIM-1234567", signal: 3, isProtected: true },
  { id: 3, name: "ILIAD-34781 Public", signal: 1, isProtected: false },
];

const trashNode: AppNode = {
  name: "trash",
  type: "app",
  icon: "app:trash",
  id: "trash",
};

// TODO: Add more defaults apps without any functionality
export const defaultApps: AppNode[] = [
  trashNode,
  {
    name: "settings",
    type: "app",
    icon: "app:settings",
    id: "settings",
  },
  {
    name: "files",
    type: "app",
    icon: "app:files",
    id: "files",
  },
  {
    name: "terminal",
    type: "app",
    icon: "app:terminal",
    id: "terminal",
  },
  {
    name: "brave",
    type: "app",
    icon: "app:brave",
    id: "brave",
  },
  {
    name: "thunderbird",
    type: "app",
    icon: "app:thunderbird",
    id: "thunderbird",
  },
  {
    name: "vscode",
    type: "app",
    icon: "app:vscode",
    id: "vscode",
  },
  {
    name: "desktop.linkedin_profile",
    type: "social",
    icon: "app:linkedin",
    id: "linkedin",
  },
  {
    name: "desktop.github_profile",
    type: "social",
    icon: "app:github",
    id: "github",
  },
].map((app) => ({
  ...app,
  isOpen: false,
  isActive: false,
  isMinimized: false,
  isFullscreen: false,
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  prev: {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  },
}));

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
                children: [trashNode],
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


export const powerUpSystemLogs: SystemLog[] = [
  {
    message:
      "/dev/nvme0n1p6: clean, 2545035/12296192 files, 31314881/49164645 block",
  },
  {
    ok: true,
    action: "Finished",
    message: "Tell Plymouth To Write  Out Runtime Data.",
  },
  {
    ok: true,
    action: "Mounted",
    message: "Arbitrary Executable File Format File System.",
  },
  {
    ok: true,
    action: "Finished",
    message: "Set Up Additional Binary Formats.",
  },
  {
    action: "Starting",
    message: "Network Time Synchronization...",
  },
  {
    action: "Starting",
    message: "Record System Boot/Shutdown in UTMP...",
  },
  {
    ok: true,
    action: "Finished",
    message: "Record System Boot/Shutdown in UTMP.",
  },
  {
    ok: true,
    action: "Started",
    message: "Network Time Synchronization.",
  },
  {
    ok: true,
    action: "Reached target",
    message: "System Initialization.",
  },
  {
    ok: true,
    action: "Started",
    message: "Daily Cleanup of Temporary Directories.",
  },
  {
    ok: true,
    action: "Reached target",
    message: "System Time Set.",
  },
  {
    ok: true,
    action: "Started",
    message: "Refresh Existing PGP keys of archlinux-keyring regularly.",
  },
  {
    ok: true,
    action: "Started",
    message: "Balance block groups on btrfs filesystem.",
  },
  {
    ok: true,
    action: "Started",
    message: "Scrub btrfs filesystem, verify block checksums.",
  },
  {
    ok: true,
    action: "Started",
    message: "Discard unused block on a mounted filesystem.",
  },
  {
    ok: true,
    action: "Started",
    message: "Discard unused filesystem block once a week.",
  },
  {
    ok: true,
    action: "Started",
    message: "Daily rotation of log files.",
  },
  {
    ok: true,
    action: "Started",
    message: "Daily man-db regeneration.",
  },
  {
    ok: true,
    action: "Started",
    message: "Monthly clean packages cache.",
  },

  {
    ok: true,
    action: "Started",
    message: "Generate mirrorlist weekly.",
  },
  {
    ok: true,
    action: "Started",
    message: "Daily verification of password and group files.",
  },
  {
    ok: true,
    action: "Reached target",
    message: "Timer Units.",
  },
  {
    ok: true,
    action: "Listening on",
    message: "D-Bus System Message Bus Socket.",
  },
  {
    action: "Starting",
    message: "Docker Socket for the API...",
  },
  {
    action: "Starting",
    message: "Socket activation for snappy daemon...",
  },
  {
    ok: true,
    action: "Listening on",
    message: "OpenSSH Server Socket (systemd-ssh-generator, AF_UNIX Local).",
  },
  {
    ok: true,
    action: "Listening on",
    message: "Hostname Service Socket.",
  },
  {
    action: "Starting",
    message: "D-Bus System Message Bus...",
  },
  {
    ok: true,
    action: "Listening on",
    message: "Socket activation for snappy daemon.",
  },
  {
    ok: true,
    action: "Listening on",
    message: "Docker Socket for the API.",
  },
  {
    ok: true,
    action: "Reached target",
    message: "Socket Units.",
  },
  {
    ok: true,
    action: "Started",
    message: "D-Bus System Message Bus.",
  },
  {
    ok: true,
    action: "Reached target",
    message: "Basic System.",
  },
  {
    action: "Starting",
    message: "Network Manager...",
  },
  {
    action: "Starting",
    message: "Bluetooth service...",
  },
  {
    action: "Starting",
    message: "Optimus Manager Commands Daemon...",
  },
  {
    action: "Starting",
    message: "User Login Management...",
  },
  {
    ok: true,
    action: "Started",
    message: "Bluetooth service.",
  },
  {
    ok: true,
    action: "Reached target",
    message: "Bluetooth Support.",
  },
  {
    action: "Starting",
    message: "Hostname Service...",
  },
  {
    ok: true,
    action: "Started",
    message: "User Login Management.",
  },
  {
    ok: true,
    action: "Started",
    message: "Hostname Service.",
  },
  {
    action: "Starting",
    message: "Network Manager Script Dispatcher Service...",
  },
  {
    ok: true,
    action: "Started",
    message: "Network Manager Script Dispatcher Service.",
  },
  {
    ok: true,
    action: "Started",
    message: "Optimus Manager Commands Daemon.",
  },
  {
    ok: true,
    action: "Started",
    message: "Network Manager.",
  },
  {
    ok: true,
    action: "Reached target",
    message: "Network.",
  },
  {
    action: "Starting",
    message: "Network Manager Wait Online...",
  },
  {
    action: "Starting",
    message: "containerd container runtime...",
  },
  {
    ok: true,
    action: "Started",
    message: "Service for snap application cups.cups-browsed.",
  },
  {
    ok: true,
    action: "Started",
    message: "Service for snap application cups.cupsd.",
  },
  {
    action: "Starting",
    message: "Permit User Sessions...",
  },
  {
    ok: true,
    action: "Finished",
    message: "Permit User Sessions.",
  },
  {
    ok: true,
    action: "Started",
    message: "Command Scheduler.",
  },
  {
    action: "Starting",
    message: "GNOME Display Manager...",
  },
  {
    action: "Starting",
    message: "Hold until boot process finishes up...",
  },
  {
    ok: true,
    action: "Started",
    message: "GNOME Display Manager.",
  },
];

export const powerOffSystemLogs: SystemLog[] = [
  {
    ok: true,
    action: "Unmounted",
    message: "/run/user/120.",
  },
  {
    ok: true,
    action: "Stopped",
    message: "Permit User Sessions.",
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
    message: "OpenSSH Server Socket (systemd-ssh-generator, AF_UNIX Local).",
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
