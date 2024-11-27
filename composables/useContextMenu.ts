import { computed } from "vue";
import type {
  Node,
  ShortcutNode,
  ContextMenuTargetType,
  AppNode,
  FolderNode,
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
  const { createItem, editItem, moveItem, addToBookmarks, openApp, closeApp } =
    desktopStore;

  const { currentSettingsTab } = storeToRefs(useGlobalStore());

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

  const getFileOptions = (node: Node | null) => [
    { label: "Open", action: () => openFile(node) },
    {
      label: `${t("rename")}...`,
      action: () => renameNode(node),
    },
    {
      label: t("move_to_trash"),
      action: () => moveToTrash(node),
    },
    { isSeparator: true },
    { label: t("properties"), action: () => console.log("Properties") },
  ];

  const getFolderOptions = (node: Node | null) => [
    { label: t("open"), action: () => openFolder(node) },
    {
      label: `${t("rename")}...`,
      action: () => renameNode(node),
    },
    {
      label: t("move_to_trash"),
      action: () => moveToTrash(node),
    },
    { isSeparator: true },
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
    { label: t("properties"), action: () => console.log("Properties") },
    {
      label: t("show_x_in_files", { target: t("folder") }),
      action: () => console.log("Show in Files"),
    },
  ];

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

  const getAppOptions = (node: Node | null) => [
    { id: "open", label: t("open"), action: () => handleOpenApp(node) },
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
      actualTargetNode = findNodeByIdRecursive(
        desktopStore.fileSystem,
        shortcut.targetId,
      );
      if (actualTargetNode) {
        actualTargetType = actualTargetNode.type;
      }
    }

    switch (actualTargetType) {
      case "desktop":
        return getDesktopOptions();
      case "file":
        return getFileOptions(actualTargetNode);
      case "folder":
        return getFolderOptions(actualTargetNode);
      case "dock":
        return getDockOptions(actualTargetNode);
      case "app":
        return getAppOptions(actualTargetNode);
      case "shortcut":
        // For shortcuts, use the options based on the target's type
        switch (actualTargetNode?.type) {
          case "file":
            return getFileOptions(actualTargetNode);
          case "folder":
            return getFolderOptions(actualTargetNode);
          case "app":
            return getAppOptions(actualTargetNode);
          default:
            return [];
        }
      default:
        return [];
    }
  });

  const createNewFolder = () => {
    if (desktopNode.value) {
      createItem(desktopNode.value.id, {
        name: t("new_folder"),
        type: "folder",
        icon: "folder:folder",
        isRenaming: true,
        isNewlyCreated: true,
      });
    }
    closeContextMenu();
  };

  const createNewDocument = () => {
    if (desktopNode.value) {
      createItem(desktopNode.value.id, {
        name: t("new_document"),
        type: "file",
        icon: "file:file",
        isRenaming: true,
        isNewlyCreated: true,
      });
    }
    closeContextMenu();
  };

  const handleOpenApp = async (node: Node | null) => {
    if (!node) return;

    const minimizeIfALreadyOpen = node.type === "app" ? true : false;

    if (!isDockPinned.value) {
      isDockVisible.value = false;
    }

    if (node.type === "social") {
      const { linkedin, github } = useRuntimeConfig().public.socialUrl;
      const url = node.id === "linkedin" ? linkedin : github;
      if (url) {
        window.open(url as string, "_blank");
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

  const openFile = (node: Node | null) => {
    if (!node) return;

    console.log(`Opening file: ${node.name}`);
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

    editItem(node.id, { isRenaming: true });
    closeContextMenu();
  };

  const moveToTrash = (node: Node | null) => {
    if (!node) return;

    moveItem(node.id, "trash");
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
