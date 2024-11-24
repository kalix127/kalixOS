import type { FileSystemNode, AppNode } from "@/types";
import { useEventListener } from "@vueuse/core";
import { defaultFilePermissions, defaultFolderPermissions } from "@/constants";

export function useContextMenu() {
  const { t } = useI18n();

  const contextMenuStore = useContextMenuStore();
  const desktopStore = useDesktopStore();

  const { isOpen, x, y, targetType, targetNode } =
    storeToRefs(contextMenuStore);
  const { closeContextMenu } = contextMenuStore;

  const {
    desktopNode,
    trashNode,
    isDockPinned,
    isDockVisible,
    hasAppsLoading,
  } = storeToRefs(desktopStore);
  const {
    createItem,
    editItem,
    moveItem,
    addToBookmarks,
    openApp,
    closeApp,
    toggleMinimizeApp,
  } = desktopStore;

  // Close context menu on clicking outside or pressing Escape
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

  const menuOptions = computed(() => {
    switch (targetType.value) {
      case "desktop":
        return [
          { label: t("new_folder"), action: () => createNewFolder() },
          { label: t("new_document"), action: () => createNewDocument() },
          { isSeparator: true },
          {
            label: `${t("change_background")}...`,
            action: () => console.log("Change Background"),
          },
          {
            label: t("display_settings"),
            action: () => console.log("Display Settings"),
          },
        ];
      case "file":
        return [
          { label: "Open", action: () => openFile(targetNode.value) },
          {
            label: `${t("rename")}...`,
            action: () => renameNode(targetNode.value),
          },
          {
            label: t("move_to_trash"),
            action: () => moveToTrash(targetNode.value),
          },
          { isSeparator: true },
          {
            label: t("properties"),
            action: () => console.log("Properties"),
          },
        ];
      case "folder":
        return [
          { label: t("open"), action: () => openFolder(targetNode.value) },
          {
            label: `${t("rename")}...`,
            action: () => renameNode(targetNode.value),
          },
          {
            label: t("move_to_trash"),
            action: () => moveToTrash(targetNode.value),
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
            action: () => addToBookmarksAction(targetNode.value),
          },
          {
            label: t("properties"),
            action: () => console.log("Properties"),
          },
          {
            label: t("show_x_in_files", { target: t("folder") }),
            action: () => console.log("Show in Files"),
          },
        ];
      case "app":
        return [
          { label: t("open"), action: () => handleOpenApp(targetNode.value) },
        ];
      case "dock":
        return [
          // Show "Open" option only if the app is closed
          ...(targetNode.value.isOpen
            ? []
            : [
                { isSeparator: true },
                {
                  label: t("open"),
                  action: () => handleOpenApp(targetNode.value),
                },
              ]),
          // Show "App Details" option only if the app is not a social app
          ...(targetNode.value?.type === "social"
            ? []
            : [
                { isSeparator: true },
                {
                  label: t("app_details"),
                  action: () => handleAppDetails(targetNode.value),
                },
              ]),
          // Show "Quit" option only if the app is open
          ...(targetNode.value?.isOpen
            ? [
                { isSeparator: true },
                {
                  label: t("quit"),
                  action: () => handleCloseApp(targetNode.value),
                },
              ]
            : []),
        ];
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
        permissions: defaultFolderPermissions,
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
        permissions: defaultFilePermissions,
      });
    }
    closeContextMenu();
  };

  const handleOpenApp = async (node: FileSystemNode | AppNode | null) => {
    if (node) {
      if (!isDockPinned.value) {
        isDockVisible.value = false;
      }

      // If the app is a social app, open the corresponding URL
      if (node.type === "social") {
        const { linkedin, github } = useRuntimeConfig().public.socialUrl;
        const url = node.id === "linkedin" ? linkedin : github;
        if (url) {
          window.open(url as string, "_blank");
        }
        return;
      }

      openApp(node.id);
    }
    closeContextMenu();
  };

  const handleCloseApp = (node: FileSystemNode | AppNode | null) => {
    if (node) {
      closeApp(node.id);
    }
    closeContextMenu();
  };

  // TODO: Implement
  const handleAppDetails = (node: FileSystemNode | AppNode | null) => {
    if (node) {
      console.log(`App Details: ${node.name}`);
    }
    closeContextMenu();
  };

  // TODO: Implement
  const openFolder = (node: FileSystemNode | AppNode | null) => {
    if (node) {
      console.log(`Opening folder: ${node.name}`);
    }
    closeContextMenu();
  };

  // TODO: Implement
  const openFile = (node: FileSystemNode | AppNode | null) => {
    if (node) {
      console.log(`Opening file: ${node.name}`);
    }
    closeContextMenu();
  };

  const addToBookmarksAction = (node: FileSystemNode | AppNode | null) => {
    if (!node || node.type !== "folder") {
      return;
    }

    addToBookmarks(node.id);
    closeContextMenu();
  };

  const renameNode = (node: FileSystemNode | AppNode | null) => {
    if (node) {
      editItem(node.id, { isRenaming: true });
    }
    closeContextMenu();
  };

  const moveToTrash = (node: FileSystemNode | AppNode | null) => {
    if (node && trashNode.value) {
      moveItem(node.id, trashNode.value.id);
    }
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
