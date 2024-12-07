import { computed } from "vue";
import type {
  Node,
  ShortcutNode,
  ContextMenuTargetType,
  AppNode,
  FolderNode,
  FileNode,
} from "@/types";
import { findNodeByIdRecursive } from "~/helpers";
import { useEventListener } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";

export function useContextMenu() {
  const { t } = useI18n();

  const contextMenuStore = useContextMenuStore();
  const desktopStore = useDesktopStore();

  const { isOpen, x, y, targetType, targetNode } =
    storeToRefs(contextMenuStore);
  const { closeContextMenu } = contextMenuStore;

  const { desktopNode, isDockPinned, isDockVisible } =
    storeToRefs(desktopStore);
  const { createNode, editNode, moveNode, addToBookmarks, openApp, closeApp } =
    desktopStore;

  const { currentSettingsTab } = storeToRefs(useGlobalStore());
  const { setFileNode } = useKateStore();
  const { setCurrentDirectory } = useTerminalStore();

  useEventListener("click", () => {
    if (isOpen.value) {
      closeContextMenu();
    }
  });
  useEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape" && isOpen.value) {
      closeContextMenu();
    }
  });

  const contextMenuStyle = computed(() => ({
    position: "absolute",
    top: `${y.value}px`,
    left: `${x.value}px`,
  }));

  /* Menu options based on type */
  const getDesktopOptions = () => [
    { label: t("new_folder"), action: () => createNewFolder() },
    { label: t("new_document"), action: () => createNewDocument() },
    { isSeparator: true },
    {
      label: `${t("change_background")}...`,
      action: () => {
        currentSettingsTab.value = "appearance";
        openApp("settings");
        closeContextMenu();
      },
    },
    {
      label: t("display_settings"),
      action: () => {
        currentSettingsTab.value = "displays";
        openApp("settings");
        closeContextMenu();
      },
    },
  ];

  const getFileOptions = (node: FileNode | null, shortcut?: ShortcutNode) => {
    const options = [
      { label: "Open", action: () => openFile(node) },
      {
        label: shortcut ? t("rename_shortcut") : t("rename"),
        action: () => renameNode(shortcut || node),
      },
      {
        label: t("move_to_trash"),
        action: () => moveToTrash(shortcut || node),
      },
      { isSeparator: true },
      { label: t("properties"), action: () => console.log("Properties") },
    ];

    // Remove 'rename' and 'move to trash' options if node is protected
    if (node?.isProtected) {
      options.splice(1, 2);
    }

    return options;
  };

  const getFolderOptions = (node: FolderNode | null, shortcut?: ShortcutNode) => {
    const baseOptions: Array<{
      label?: string;
      action?: () => void;
      isSeparator?: boolean;
    }> = [
      { label: t("open"), action: () => openFolder(node) },
      {
        label: shortcut ? t("rename_shortcut") : t("rename"),
        action: () => renameNode(shortcut || node),
      },
      {
        label: t("move_to_trash"),
        action: () => moveToTrash(shortcut || node),
      },
    ];

    // Remove 'rename', 'move to trash' options if node is protected
    if (node?.isProtected) {
      baseOptions.splice(1, 2);
    }

    if (!shortcut) {
      baseOptions.push(
        { isSeparator: true },
        {
          label: t("show_x_in_files", { target: t("folder") }),
          action: () => console.log("Show in Files"),
        },
        {
          label: t("compress_folder"),
          action: () => console.log("Compress 1 folder"),
        },
        {
          label: t("new_folder_with_1_item"),
          action: () => console.log("New folder with 1 item"),
        },
        { isSeparator: true },
        {
          label: t("add_to_bookmarks"),
          action: () => addToBookmarksAction(node),
        },
        {
          label: t("open_in_terminal"),
          action: () => openInTerminal(node),
        },
        { label: t("properties"), action: () => console.log("Properties") },
      );
    }

    return baseOptions;
  };

  const getDockOptions = (node: Node | null) => {
    const options = [];

    if (!node) {
      return [];
    }

    const appNode = node as AppNode;
    const isSocialApp = node.type === "social";

    // Add open option if app is not open
    if (!appNode.isOpen) {
      options.push(
        { isSeparator: true },
        {
          label: t("open"),
          action: () => {
            handleOpenApp(node);
          },
        },
      );
    }

    // Add app details for non-social apps
    if (!isSocialApp) {
      options.push(
        { isSeparator: true },
        {
          label: t("app_details"),
          action: () => handleAppDetails(node),
        },
      );
    }

    // Add quit option if app is open
    if (appNode.isOpen) {
      options.push(
        { isSeparator: true },
        {
          label: t("quit"),
          action: () => handleCloseApp(node),
        },
      );
    }
    return options;
  };

  const getAppOptions = (node: Node | null, shortcut?: ShortcutNode) => [
    { id: "open", label: t("open"), action: () => handleOpenApp(node) },
    ...(shortcut
      ? [
          {
            label: t("rename_shortcut"),
            action: () => renameNode(shortcut),
          },
          {
            label: t("move_to_trash"),
            action: () => moveToTrash(shortcut),
          },
        ]
      : []),
  ];

  const menuOptions = computed(() => {
    let actualTargetType: ContextMenuTargetType | null = targetType.value;
    let actualTargetNode: Node | null = targetNode.value;

    // Handle shortcuts
    if (
      targetType.value === "shortcut" &&
      (targetNode.value as ShortcutNode).targetId
    ) {
      const shortcut = targetNode.value as ShortcutNode;
      const target = findNodeByIdRecursive(
        desktopStore.fileSystem,
        shortcut.targetId,
      );

      if (target) {
        switch (target.type) {
          case "file":
            return getFileOptions(target, shortcut);
          case "folder":
            return getFolderOptions(target, shortcut);
          case "app":
            return getAppOptions(target, shortcut);
          default:
            return [];
        }
      }
    }

    switch (actualTargetType) {
      case "desktop":
        return getDesktopOptions();
      case "file":
        return getFileOptions(actualTargetNode as FileNode);
      case "folder":
        return getFolderOptions(actualTargetNode as FolderNode);
      case "dock":
        return getDockOptions(actualTargetNode);
      case "app":
        return getAppOptions(actualTargetNode);
      default:
        return [];
    }
  });

  const createNewFolder = () => {
    if (desktopNode.value) {
      createNode(
        desktopNode.value.id,
        {
          name: t("new_folder"),
          type: "folder",
          isRenaming: true,
          isNewlyCreated: true,
        },
        true,
      );
    }
    closeContextMenu();
  };

  const createNewDocument = () => {
    if (desktopNode.value) {
      createNode(
        desktopNode.value.id,
        {
          name: t("new_document"),
          type: "file",
          isRenaming: true,
          isNewlyCreated: true,
        },
        true,
      );
    }
    closeContextMenu();
  };

  const openInTerminal = (node: FolderNode | null) => {
    if (!node) return;

    setCurrentDirectory(node);
    openApp("terminal");
  };

  const handleOpenApp = async (node: Node | null) => {
    if (!node) return;

    const minimizeIfALreadyOpen = node.type === "app" ? true : false;

    if (!isDockPinned.value) {
      isDockVisible.value = false;
    }

    if (node.type === "social") {
      const { linkedin, github, reddit } = useRuntimeConfig().public.socialUrl;
      let url = "";

      switch (node.id) {
        case "linkedin":
          url = linkedin;
          break;
        case "github":
          url = github;
          break;
        case "reddit":
          url = reddit;
          break;
      }

      if (url) {
        window.open(url, "_blank");
      }
      return;
    }

    openApp(node.id, minimizeIfALreadyOpen);
    closeContextMenu();
  };

  const handleCloseApp = (node: Node | null) => {
    if (!node) return;

    closeApp(node.id);
    closeContextMenu();
  };

  const handleAppDetails = (node: Node | null) => {
    if (!node) return;

    console.log(`App Details: ${node.name}`);
    closeContextMenu();
  };

  const openFolder = (node: Node | null) => {
    if (!node) return;

    console.log(`Opening folder: ${node.name}`);
    closeContextMenu();
  };

  const openFile = (node: FileNode | null) => {
    if (!node) return;

    setFileNode(node);
    openApp("kate");
    closeContextMenu();
  };

  const addToBookmarksAction = (node: Node | null) => {
    if (!node || node.type !== "folder") {
      return;
    }

    addToBookmarks(node.id);
    closeContextMenu();
  };

  const renameNode = (node: Node | null) => {
    if (!node) return;

    editNode(node.id, { isRenaming: true });
    closeContextMenu();
  };

  const moveToTrash = (node: Node | null) => {
    if (!node) return;

    moveNode(node.id, "trash");
    closeContextMenu();
  };

  return {
    isOpen,
    x,
    y,
    targetType,
    targetNode,
    contextMenuStyle,
    menuOptions,
    handleOpenApp,
  };
}
