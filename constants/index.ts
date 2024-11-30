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
    isSaved: true,
    details: {
      linkSpeed: "103 Mb/s",
      security: "WPA2",
      ipv4: "423.168.999.100",
      ipv6: "3001:xyz::1",
      hardwareAddress: "00:1A:2B:3C:4D:5E",
      supportedFrequencies: ["2.4 GHz", "5 GHz"],
      defaultRoute: "423.168.999.1",
      dns4: ["8.8.1.8", "8.8.1.4"],
      dns6: ["2001:4860:4860::8888", "2001:4860:4860::8844"],
    },
  },
  {
    id: 2,
    name: "VODAFONE-5G",
    signal: 4,
    isProtected: false,
    details: {
      linkSpeed: "150 Mb/s",
      security: "None",
      ipv4: "555.444.333.222",
      ipv6: "8888:void::4",
      hardwareAddress: "00:4D:5E:6F:7G:8H",
      supportedFrequencies: ["2.4 GHz", "5 GHz"],
      defaultRoute: "555.444.333.1",
      dns4: ["444.555.666.777", "777.666.555.444"],
      dns6: ["9999:dead::beef", "9999:dead::cafe"],
    },
  },
  {
    id: 3,
    name: "TIM-1234567",
    signal: 3,
    isProtected: true,
    details: {
      linkSpeed: "72 Mb/s",
      security: "WPA3",
      ipv4: "892.671.445.105",
      ipv6: "9999:invalid::2",
      hardwareAddress: "00:2B:3C:4D:5E:6F",
      supportedFrequencies: ["2.4 GHz"],
      defaultRoute: "892.671.445.1",
      dns4: ["1.1.1.1", "1.0.0.1"],
      dns6: ["2606:4700:4700::1111", "2606:4700:4700::1001"],
    },
  },
  {
    id: 4,
    name: "NETGEAR-GUEST",
    signal: 3,
    isProtected: true,
    details: {
      linkSpeed: "86 Mb/s",
      security: "WPA2",
      ipv4: "777.888.999.111",
      ipv6: "5555:fake::5",
      hardwareAddress: "00:5E:6F:7G:8H:9I",
      supportedFrequencies: ["2.4 GHz"],
      defaultRoute: "777.888.999.1",
      dns4: ["333.222.111.000", "000.111.222.333"],
      dns6: ["7777:dead::1234", "7777:dead::5678"],
    },
  },

  {
    id: 5,
    name: "TP-LINK_OFFICE",
    signal: 2,
    isProtected: true,
    details: {
      linkSpeed: "45 Mb/s",
      security: "WPA3",
      ipv4: "444.333.222.111",
      ipv6: "4444:null::6",
      hardwareAddress: "00:6F:7G:8H:9I:0J",
      supportedFrequencies: ["2.4 GHz", "5 GHz"],
      defaultRoute: "444.333.222.1",
      dns4: ["111.222.333.444", "444.333.222.111"],
      dns6: ["6666:dead::abcd", "6666:dead::dcba"],
    },
  },
  {
    id: 6,
    name: "LINKSYS_HOME",
    signal: 2,
    isProtected: true,
    details: {
      linkSpeed: "35 Mb/s",
      security: "WPA2",
      ipv4: "666.555.444.333",
      ipv6: "3333:void::7",
      hardwareAddress: "00:7G:8H:9I:0J:1K",
      supportedFrequencies: ["2.4 GHz"],
      defaultRoute: "666.555.444.1",
      dns4: ["555.666.777.888", "888.777.666.555"],
      dns6: ["5555:dead::9876", "5555:dead::6789"],
    },
  },
  {
    id: 7,
    name: "ILIAD-34781 Public",
    signal: 1,
    isProtected: false,
    details: {
      linkSpeed: "13 Mb/s",
      security: "None",
      ipv4: "999.777.666.110",
      ipv6: "7777:bad::3",
      hardwareAddress: "00:3C:4D:5E:6F:7G",
      supportedFrequencies: ["2.4 GHz", "5 GHz"],
      defaultRoute: "999.777.666.1",
      dns4: ["208.67.222.222", "208.67.220.220"],
      dns6: ["2620:119:35::35", "2620:119:53::53"],
    },
  },
  {
    id: 8,
    name: "DLINK-PUBLIC",
    signal: 1,
    isProtected: false,
    details: {
      linkSpeed: "24 Mb/s",
      security: "None",
      ipv4: "888.777.666.555",
      ipv6: "2222:bad::8",
      hardwareAddress: "00:8H:9I:0J:1K:2L",
      supportedFrequencies: ["2.4 GHz", "5 GHz"],
      defaultRoute: "888.777.666.1",
      dns4: ["999.888.777.666", "666.777.888.999"],
      dns6: ["4444:dead::5555", "4444:dead::6666"],
    },
  },
];

/* File system */

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
].map((app) => ({
  ...app,
  isOpen: false,
  isActive: false,
  isMinimized: false,
  isFullscreen: false,
  isModalOpen: false,
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

export const defaultDockbarItems: AppNodes[] = [
  ...defaultApps,
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
];

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
