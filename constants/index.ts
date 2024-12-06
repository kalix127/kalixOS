// @ts-nocheck
import type {
  WifiNetwork,
  SystemLog,
  AppNode,
  BackgroundImage,
  NodePermissions,
  CommandSpec,
  Node,
} from "@/types";
import { assignDefaultProperties } from "~/helpers";
import { zshContent } from "./files";

/* General */

export const defaultUsername = "Gianluca";

export const defaultBootDuration = 5000;

export const defaultDimScreenThreshold = "300000"; // 5 minutes

export const defaultBookmarks = ["coding"];

export const defaultBackgroundImage: BackgroundImage = {
  url: "img/bg-desktop.jpg",
  name: "default",
};

export const defaultBackgroundImages: BackgroundImage[] = [
  defaultBackgroundImage,
];

export const defaultFullscreenApps = ["brave", "code"];

export const desktopOnlyApps = ["brave", "code", "terminal", "files", "files"]

export const desktopEnvironments = [
  "gnome",
  "gnome_classic",
  "gnome_classic_xorg",
  "gnome_xorg",
];

export const defaultNetworks: WifiNetwork[] = [
  {
    id: 1,
    name: "FASTWEB-7632798",
    signal: 4,
    isProtected: true,
  },
  {
    id: 2,
    name: "VODAFONE-5G",
    signal: 4,
    isProtected: false,
  },
  {
    id: 3,
    name: "TIM-1234567",
    signal: 3,
    isProtected: true,
  },
  {
    id: 4,
    name: "NETGEAR-GUEST",
    signal: 3,
    isProtected: true,
  },

  {
    id: 5,
    name: "TP-LINK_OFFICE",
    signal: 2,
    isProtected: true,
  },
  {
    id: 6,
    name: "LINKSYS_HOME",
    signal: 2,
    isProtected: true,
  },
  {
    id: 7,
    name: "ILIAD-34781 Public",
    signal: 1,
    isProtected: false,
  },
  {
    id: 8,
    name: "DLINK-PUBLIC",
    signal: 1,
    isProtected: false,
  },
];

/* File system */

export const defaultFolders = [
  {
    id: "home",
    name: "Home",
    icon: "gnome:home",
  },
  {
    id: "desktop",
    name: "Desktop",
    icon: "gnome:desktop",
  },
  {
    id: "applications",
    name: "Applications",
    icon: "gnome:applications",
  },
  {
    id: "downloads",
    name: "Downloads",
    icon: "gnome:downloads",
  },
  {
    id: "documents",
    name: "Documents",
    icon: "gnome:documents",
  },
  {
    id: "music",
    name: "Music",
    icon: "gnome:music",
  },
  {
    id: "pictures",
    name: "Pictures",
    icon: "gnome:pictures",
  },
  {
    id: "videos",
    name: "Videos",
    icon: "gnome:videos",
  },
  {
    id: "trash",
    name: "Trash",
    icon: "gnome:trash",
  },
  {
    id: "root",
    name: "Manjaro Linux",
    icon: "gnome:hdd-2",
  },
];

export const defaultFilePermissions = {
  owner: { read: true, write: true, execute: false },
  group: { read: true, write: false, execute: false },
  others: { read: true, write: false, execute: false },
};

export const defaultFolderPermissions = {
  owner: { read: true, write: true, execute: true },
  group: { read: true, write: false, execute: true },
  others: { read: true, write: false, execute: true },
};

export const defaultShortcutPermissions = {
  owner: { read: true, write: true, execute: true },
  group: { read: true, write: true, execute: true },
  others: { read: true, write: true, execute: true },
};

export const defaultAppPermissions = {
  owner: { read: true, write: true, execute: true },
  group: { read: true, write: true, execute: true },
  others: { read: true, write: true, execute: true },
};

export const defaultApps: AppNode[] = [
  {
    id: "settings",
    name: "Settings",
    type: "app",
    icon: "app:settings",
  },
  {
    id: "files",
    name: "Files",
    type: "app",
    icon: "app:files",
  },
  {
    id: "terminal",
    name: "Terminal",
    type: "app",
    icon: "app:terminal",
  },
  {
    id: "brave",
    name: "Brave",
    type: "app",
    icon: "app:brave",
  },
  {
    id: "thunderbird",
    name: "Thunderbird",
    type: "app",
    icon: "app:thunderbird",
  },
  {
    id: "code",
    name: "Visual Studio Code",
    type: "app",
    icon: "app:vscode",
  },
  {
    id: "kate",
    name: "Kate",
    type: "app",
    icon: "app:kate",
  },
  {
    id: "github",
    name: "github_profile",
    type: "social",
    icon: "app:github",
    isTranslated: true,
  },
  {
    id: "reddit",
    name: "reddit_profile",
    type: "social",
    icon: "app:reddit",
    isTranslated: true,
  },
  {
    id: "linkedin",
    name: "linkedin_profile",
    type: "social",
    icon: "app:linkedin",
    isTranslated: true,
  },
  {
    id: "show-apps",
    name: "show_apps",
    type: "app",
    icon: "gnome:grid",
    isTranslated: true,
  },
].map((app) => ({
  ...app,
  title: "",
  isOpen: false,
  isActive: false,
  isMinimized: false,
  isFullscreen: false,
  isDropdownOpen: false,
  isNewlyOpened: false,
  width: 0,
  height: 0,
  x: 0,
  y: 1,
  prev: {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  },
}));

export const defaultFileSystem = (username: string): Node =>
  assignDefaultProperties(
    {
      id: "root",
      name: "/",
      type: "folder",
      isProtected: true,
      icon: "folder:folder",
      children: [
        {
          name: "home",
          type: "folder",
          isProtected: true,
          icon: "folder:home",
          children: [
            {
              id: "home",
              name: username,
              isProtected: true,
              type: "folder",
              icon: "folder:folder",
              children: [
                {
                  id: "desktop",
                  name: "Desktop",
                  type: "folder",
                  icon: "folder:desktop",
                  isProtected: true,
                  children: [
                    {
                      id: "trash-shortcut",
                      name: "Trash",
                      type: "shortcut",
                      icon: "app:trash",
                      isShortcut: true,
                      targetId: "trash",
                      children: [],
                      isProtected: true,
                      permissions: defaultShortcutPermissions,
                    },
                  ],
                },
                {
                  id: "applications",
                  name: "Applications",
                  type: "folder",
                  icon: "folder:applications",
                  isProtected: true,
                  children: [
                    ...defaultApps.map((app) => ({
                      ...app,
                      name: `${app.name.replaceAll(" ", "")}.AppImage`,
                    })),
                  ],
                },
                {
                  id: "downloads",
                  name: "Downloads",
                  type: "folder",
                  icon: "folder:donwloads",
                  children: [],
                },
                {
                  id: "documents",
                  name: "Documents",
                  type: "folder",
                  icon: "folder:documents",
                  children: [],
                },
                {
                  id: "pictures",
                  name: "Pictures",
                  type: "folder",
                  icon: "folder:pictures",
                  children: [],
                },
                {
                  id: "music",
                  name: "Music",
                  type: "folder",
                  icon: "folder:music",
                  children: [],
                },
                {
                  id: "videos",
                  name: "Videos",
                  type: "folder",
                  icon: "folder:videos",
                  children: [],
                },
                {
                  name: ".local",
                  type: "folder",
                  icon: "folder:folder",
                  isProtected: true,
                  children: [
                    {
                      name: "share",
                      type: "folder",
                      icon: "folder:folder",
                      isProtected: true,
                      children: [
                        {
                          id: "trash",
                          name: "Trash",
                          type: "folder",
                          icon: "folder:folder",
                          isProtected: true,
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: ".zshrc",
                  type: "file",
                  icon: "file:file",
                  content: zshContent,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          name: "bin",
          type: "folder",
          icon: "folder:folder",
          children: [
            {
              id: "cd",
              name: "cd",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "ls",
              name: "ls",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "ln",
              name: "ln",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "pwd",
              name: "pwd",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "tree",
              name: "tree",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "chown",
              name: "chown",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "chmod",
              name: "chmod",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "touch",
              name: "touch",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "mkdir",
              name: "mkdir",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "mv",
              name: "mv",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "rm",
              name: "rm",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "cat",
              name: "cat",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "ps",
              name: "ps",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "kill",
              name: "kill",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "pkill",
              name: "pkill",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "free",
              name: "free",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "df",
              name: "df",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "whoami",
              name: "whoami",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "neofetch",
              name: "neofetch",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "clear",
              name: "clear",
              type: "file",
              icon: "file:bash",
              children: [],
            },
            {
              id: "help",
              name: "help",
              type: "file",
              icon: "file:bash",
              children: [],
            },
          ],
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
    },
    username,
  );

/* Terminal */

export const commandSpecs: { [commandName: string]: CommandSpec } = {
  cd: {
    acceptsFlags: ["-h"],
    flagAliases: {
      "--help": "-h",
    },
    positionalArgs: [{ name: "directory", required: false }],
  },
  ls: {
    acceptsFlags: ["-l", "-a", "-h"],
    flagAliases: {
      "--list": "-l",
      "--all": "-a",
      "--human-readable": "-h",
      "--help": "-h",
    },
    positionalArgs: [{ name: "path", required: false }],
  },
  ln: {
    acceptsFlags: ["-s", "-h"],
    flagAliases: {
      "--symbolic": "-s",
      "--help": "-h",
    },
    positionalArgs: [
      { name: "target", required: true },
      { name: "link", required: true },
    ],
  },
  pwd: {
    acceptsFlags: ["-h"],
    flagAliases: {
      "--help": "-h",
    },
    positionalArgs: [],
  },
  tree: {
    acceptsFlags: ["-L", "-h"],
    flagAliases: {
      "--level": "-L",
      "--help": "-h",
    },
    flagsWithValues: ["-L"],
    positionalArgs: [{ name: "path", required: false }],
  },
  chown: {
    acceptsFlags: ["-h"],
    flagAliases: {
      "--help": "-h",
    },
    positionalArgs: [
      { name: "owner:group", required: true },
      { name: "file", required: true },
    ],
  },
  chmod: {
    acceptsFlags: ["-h"],
    flagAliases: {
      "--help": "-h",
    },
    positionalArgs: [
      { name: "mode", required: true },
      { name: "file", required: true },
    ],
  },
  touch: {
    acceptsFlags: ["-h"],
    flagAliases: {
      "--help": "-h",
    },
    positionalArgs: [{ name: "file", required: true }],
  },
  mkdir: {
    acceptsFlags: ["-h"],
    flagAliases: {
      "--help": "-h",
    },
    positionalArgs: [{ name: "directory", required: true }],
  },
  mv: {
    acceptsFlags: ["-h"],
    flagAliases: {
      "--help": "-h",
    },
    positionalArgs: [
      { name: "source", required: true },
      { name: "destination", required: true },
    ],
  },
  rm: {
    acceptsFlags: ["-r", "-h"],
    flagAliases: {
      "--recursive": "-r",
      "--help": "-h",
    },
    positionalArgs: [{ name: "file", required: true }],
  },
  cat: {
    acceptsFlags: ["-h"],
    flagAliases: {
      "--help": "-h",
    },
    positionalArgs: [{ name: "file", required: true }],
  },
  ps: {
    acceptsFlags: ["-h"],
    flagAliases: {
      "--help": "-h",
    },
    positionalArgs: [],
  },
  kill: {
    acceptsFlags: ["-h"],
    flagAliases: {
      "--help": "-h",
    },
    positionalArgs: [{ name: "pid", required: true }],
  },
  pkill: {
    acceptsFlags: ["-f", "-h"],
    flagAliases: {
      "--full": "-f",
      "--help": "-h",
    },
    positionalArgs: [{ name: "pattern", required: true }],
  },
  free: {
    acceptsFlags: ["-h", "--help"],
    flagAliases: {
      "--human": "-h",
      "--help": "--help",
    },
    positionalArgs: [],
  },
  df: {
    acceptsFlags: ["-h", "--help"],
    flagAliases: {
      "--human": "-h",
      "--help": "--help",
    },
    positionalArgs: [],
  },
  whoami: {
    acceptsFlags: ["-h"],
    flagAliases: {
      "--help": "-h",
    },
    positionalArgs: [],
  },
  clear: {
    acceptsFlags: ["-h"],
    flagAliases: {
      "--help": "-h",
    },
    positionalArgs: [],
  },
  neofetch: {
    acceptsFlags: ["-h"],
    flagAliases: {
      "--help": "-h",
    },
    positionalArgs: [],
  },
  help: {
    acceptsFlags: [],
    flagAliases: {},
    positionalArgs: [],
  },
};

/* System Logs */

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

export const monacoEditorLanguageMap: { [extension: string]: string } = {
  // ABAP
  abap: "abap",
  // Apex
  cls: "apex",
  // Azure CLI
  azcli: "azcli",
  // Batch
  bat: "bat",
  cmd: "bat",
  // Bicep
  bicep: "bicep",
  // Cameligo
  mligo: "cameligo",
  // Clojure
  clj: "clojure",
  cljs: "clojure",
  cljc: "clojure",
  edn: "clojure",
  // CoffeeScript
  coffee: "coffeescript",
  litcoffee: "coffeescript",
  // C/C++
  c: "cpp",
  h: "cpp",
  cpp: "cpp",
  hh: "cpp",
  hpp: "cpp",
  cc: "cpp",
  // C#
  cs: "csharp",
  csx: "csharp",
  // CSP
  csp: "csp",
  // CSS
  css: "css",
  // Cypher
  cql: "cypher",
  // Dart
  dart: "dart",
  // Dockerfile
  dockerfile: "dockerfile",
  Dockerfile: "dockerfile",
  // ECL
  ecl: "ecl",
  // Elixir
  ex: "elixir",
  exs: "elixir",
  // Flow9
  flow: "flow9",
  // F#
  fs: "fsharp",
  fsi: "fsharp",
  fsx: "fsharp",
  // Freemarker2
  ftl: "freemarker2",
  // Go
  go: "go",
  // GraphQL
  graphql: "graphql",
  gql: "graphql",
  // Handlebars
  hbs: "handlebars",
  // HCL
  hcl: "hcl",
  tf: "hcl",
  // HTML
  html: "html",
  htm: "html",
  // INI
  ini: "ini",
  cfg: "ini",
  // Java
  java: "java",
  // JavaScript
  js: "javascript",
  cjs: "javascript",
  mjs: "javascript",
  // Julia
  jl: "julia",
  // Kotlin
  kt: "kotlin",
  kts: "kotlin",
  // Less
  less: "less",
  // Lexon
  lex: "lexon",
  // Lua
  lua: "lua",
  // Liquid
  liquid: "liquid",
  // M3
  m3: "m3",
  // Markdown
  md: "markdown",
  markdown: "markdown",
  // MDX
  mdx: "mdx",
  // MIPS
  s: "mips",
  asm: "mips",
  // MS DAX
  dax: "msdax",
  // Pascal
  pas: "pascal",
  pp: "pascal",
  // Pascaligo
  ligolang: "pascaligo",
  // Perl
  pl: "perl",
  pm: "perl",
  // PostgreSQL
  psql: "pgsql",
  // PHP
  php: "php",
  // PLA
  pla: "pla",
  // Postiats
  dats: "postiats",
  sats: "postiats",
  hats: "postiats",
  // Power Query
  pq: "powerquery",
  m: "powerquery",
  // PowerShell
  ps1: "powershell",
  psm1: "powershell",
  psd1: "powershell",
  // Protobuf
  proto: "protobuf",
  // Pug
  pug: "pug",
  jade: "pug",
  // Python
  py: "python",
  pyw: "python",
  // Q#
  qs: "qsharp",
  // R
  r: "r",
  // Razor
  cshtml: "razor",
  // Redis
  redis: "redis",
  // Redshift
  redshift: "redshift",
  // reStructuredText
  rst: "restructuredtext",
  // Ruby
  rb: "ruby",
  // Rust
  rs: "rust",
  // SB
  sb: "sb",
  // Scala
  scala: "scala",
  sc: "scala",
  // Scheme
  scm: "scheme",
  // SCSS
  scss: "scss",
  // Shell
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  // Solidity
  sol: "solidity",
  // Sophia
  aes: "sophia",
  // Sparql
  rq: "sparql",
  // SQL
  sql: "sql",
  // ST
  st: "st",
  // Swift
  swift: "swift",
  // SystemVerilog
  sv: "systemverilog",
  svh: "systemverilog",
  // Tcl
  tcl: "tcl",
  // Twig
  twig: "twig",
  // TypeScript
  ts: "typescript",
  // TypeSpec
  cadl: "typespec",
  // Visual Basic
  vb: "vb",
  // WGSL
  wgsl: "wgsl",
  // XML
  xml: "xml",
  xsd: "xml",
  svg: "xml",
  // YAML
  yaml: "yaml",
  yml: "yaml",
  // Plain Text (fallback)
  txt: "plaintext",
  text: "plaintext",
  log: "plaintext",
};

export const monacoTheme = {
  base: "vs-dark",
  inherit: true,
  rules: [
    {
      background: "24292e",
      token: "",
    },
    {
      foreground: "959da5",
      token: "comment",
    },
    {
      foreground: "959da5",
      token: "punctuation.definition.comment",
    },
    {
      foreground: "959da5",
      token: "string.comment",
    },
    {
      foreground: "c8e1ff",
      token: "constant",
    },
    {
      foreground: "c8e1ff",
      token: "entity.name.constant",
    },
    {
      foreground: "c8e1ff",
      token: "variable.other.constant",
    },
    {
      foreground: "c8e1ff",
      token: "variable.language",
    },
    {
      foreground: "b392f0",
      token: "entity",
    },
    {
      foreground: "b392f0",
      token: "entity.name",
    },
    {
      foreground: "f6f8fa",
      token: "variable.parameter.function",
    },
    {
      foreground: "7bcc72",
      token: "entity.name.tag",
    },
    {
      foreground: "ea4a5a",
      token: "keyword",
    },
    {
      foreground: "ea4a5a",
      token: "storage",
    },
    {
      foreground: "ea4a5a",
      token: "storage.type",
    },
    {
      foreground: "f6f8fa",
      token: "storage.modifier.package",
    },
    {
      foreground: "f6f8fa",
      token: "storage.modifier.import",
    },
    {
      foreground: "f6f8fa",
      token: "storage.type.java",
    },
    {
      foreground: "79b8ff",
      token: "string",
    },
    {
      foreground: "79b8ff",
      token: "punctuation.definition.string",
    },
    {
      foreground: "79b8ff",
      token: "string punctuation.section.embedded source",
    },
    {
      foreground: "c8e1ff",
      token: "support",
    },
    {
      foreground: "c8e1ff",
      token: "meta.property-name",
    },
    {
      foreground: "fb8532",
      token: "variable",
    },
    {
      foreground: "f6f8fa",
      token: "variable.other",
    },
    {
      foreground: "d73a49",
      fontStyle: "bold italic underline",
      token: "invalid.broken",
    },
    {
      foreground: "d73a49",
      fontStyle: "bold italic underline",
      token: "invalid.deprecated",
    },
    {
      foreground: "fafbfc",
      background: "d73a49",
      fontStyle: "italic underline",
      token: "invalid.illegal",
    },
    {
      foreground: "fafbfc",
      background: "d73a49",
      fontStyle: "italic underline",
      token: "carriage-return",
    },
    {
      foreground: "d73a49",
      fontStyle: "bold italic underline",
      token: "invalid.unimplemented",
    },
    {
      foreground: "d73a49",
      token: "message.error",
    },
    {
      foreground: "f6f8fa",
      token: "string source",
    },
    {
      foreground: "c8e1ff",
      token: "string variable",
    },
    {
      foreground: "79b8ff",
      token: "source.regexp",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp.character-class",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp constant.character.escape",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp source.ruby.embedded",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp string.regexp.arbitrary-repitition",
    },
    {
      foreground: "7bcc72",
      fontStyle: "bold",
      token: "string.regexp constant.character.escape",
    },
    {
      foreground: "c8e1ff",
      token: "support.constant",
    },
    {
      foreground: "c8e1ff",
      token: "support.variable",
    },
    {
      foreground: "c8e1ff",
      token: "meta.module-reference",
    },
    {
      foreground: "fb8532",
      token: "markup.list",
    },
    {
      foreground: "0366d6",
      fontStyle: "bold",
      token: "markup.heading",
    },
    {
      foreground: "0366d6",
      fontStyle: "bold",
      token: "markup.heading entity.name",
    },
    {
      foreground: "c8e1ff",
      token: "markup.quote",
    },
    {
      foreground: "f6f8fa",
      fontStyle: "italic",
      token: "markup.italic",
    },
    {
      foreground: "f6f8fa",
      fontStyle: "bold",
      token: "markup.bold",
    },
    {
      foreground: "c8e1ff",
      token: "markup.raw",
    },
    {
      foreground: "b31d28",
      background: "ffeef0",
      token: "markup.deleted",
    },
    {
      foreground: "b31d28",
      background: "ffeef0",
      token: "meta.diff.header.from-file",
    },
    {
      foreground: "b31d28",
      background: "ffeef0",
      token: "punctuation.definition.deleted",
    },
    {
      foreground: "176f2c",
      background: "f0fff4",
      token: "markup.inserted",
    },
    {
      foreground: "176f2c",
      background: "f0fff4",
      token: "meta.diff.header.to-file",
    },
    {
      foreground: "176f2c",
      background: "f0fff4",
      token: "punctuation.definition.inserted",
    },
    {
      foreground: "b08800",
      background: "fffdef",
      token: "markup.changed",
    },
    {
      foreground: "b08800",
      background: "fffdef",
      token: "punctuation.definition.changed",
    },
    {
      foreground: "2f363d",
      background: "959da5",
      token: "markup.ignored",
    },
    {
      foreground: "2f363d",
      background: "959da5",
      token: "markup.untracked",
    },
    {
      foreground: "b392f0",
      fontStyle: "bold",
      token: "meta.diff.range",
    },
    {
      foreground: "c8e1ff",
      token: "meta.diff.header",
    },
    {
      foreground: "0366d6",
      fontStyle: "bold",
      token: "meta.separator",
    },
    {
      foreground: "0366d6",
      token: "meta.output",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.tag",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.curly",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.round",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.square",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.angle",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.quote",
    },
    {
      foreground: "d73a49",
      token: "brackethighlighter.unmatched",
    },
    {
      foreground: "d73a49",
      token: "sublimelinter.mark.error",
    },
    {
      foreground: "fb8532",
      token: "sublimelinter.mark.warning",
    },
    {
      foreground: "6a737d",
      token: "sublimelinter.gutter-mark",
    },
    {
      foreground: "79b8ff",
      fontStyle: "underline",
      token: "constant.other.reference.link",
    },
    {
      foreground: "79b8ff",
      fontStyle: "underline",
      token: "string.other.link",
    },
  ],
  colors: {
    "editor.foreground": "#f6f8fa",
    "editor.background": "#24292e",
    "editor.inactiveSelectionBackground": "#444d56",
    "editor.lineHighlightBackground": "#444d56",
    "editorCursor.foreground": "#ffffff",
    "editorWhitespace.foreground": "#6a737d",
    "editorIndentGuide.background": "#6a737d",
    "editorIndentGuide.activeBackground": "#f6f8fa",
    "editor.selectionHighlightBorder": "#444d56",
  },
};
