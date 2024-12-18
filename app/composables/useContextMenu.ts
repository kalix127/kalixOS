import type {
  AppNode,
  ContextMenuTargetType,
  FileNode,
  FolderNode,
  Node,
  ShortcutNode,
} from "@/types";
import { findNodeByIdRecursive } from "@/helpers";
import { useEventListener } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

export function useContextMenu() {
  const { t } = useI18n();

  const contextMenuStore = useContextMenuStore();
  const desktopStore = useDesktopStore();

  const { isOpen, x, y, targetType, targetNode }
    = storeToRefs(contextMenuStore);
  const { closeContextMenu } = contextMenuStore;

  const { desktopNode, isDockPinned, isDockVisible, bookmarks }
    = storeToRefs(desktopStore);
  const {
    createNode,
    editNode,
    moveNode,
    emptyTrash,
    addToBookmarks,
    removeFromBookmarks,
    openApp,
    closeApp,
  } = desktopStore;

  const { currentSettingsTab } = storeToRefs(useGlobalStore());
  const { setCurrentDirectory } = useTerminalStore();
  const { setKateNodeId } = useKateStore();
  const { setFilesNodeId } = useFilesStore();

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

  // Handlers

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
    if (!node)
      return;

    setCurrentDirectory(node);
    openApp("terminal");
  };

  const handleOpenApp = async (node: Node | null) => {
    if (!node)
      return;

    const minimizeIfAlreadyOpen = node.type === "app";

    if (!isDockPinned.value) {
      isDockVisible.value = false;
    }

    openApp(node.id, minimizeIfAlreadyOpen);
    closeContextMenu();
  };

  const handleCloseApp = (node: AppNode | null) => {
    if (!node)
      return;

    closeApp(node.id);
    closeContextMenu();
  };

  const openFolder = (node: FolderNode | null) => {
    if (!node)
      return;

    setFilesNodeId(node.id);
    openApp("files");
    closeContextMenu();
  };

  const openFile = (node: FileNode | null) => {
    if (!node)
      return;

    setKateNodeId(node.id);
    openApp("kate");
    closeContextMenu();
  };

  const addToBookmarksAction = (node: FolderNode | null) => {
    if (!node || node.type !== "folder") {
      return;
    }

    addToBookmarks(node.id);
    closeContextMenu();
  };

  const removeFromBookmarksAction = (node: FolderNode | null) => {
    if (!node || node.type !== "folder") {
      return;
    }

    removeFromBookmarks(node.id);
    closeContextMenu();
  };

  const newFolderWithItem = (node: Node | null) => {
    if (!node || !node.parentId) {
      return;
    }

    const newFolder = createNode(
      node.parentId,
      {
        name: t("new_folder"),
        type: "folder",
        isRenaming: true,
        isNewlyCreated: true,
      },
      true,
    );
    moveNode(node.id, newFolder!.id);
    closeContextMenu();
  };

  const renameNode = (node: Node | null) => {
    if (!node)
      return;

    editNode(node.id, { isRenaming: true });
    closeContextMenu();
  };

  const moveToTrash = (node: Node | null) => {
    if (!node)
      return;

    moveNode(node.id, "trash");
    closeContextMenu();
  };

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
      { label: t("open"), action: () => openFile(node) },
      {
        label: shortcut ? t("rename_shortcut") : t("rename"),
        action: () => renameNode(shortcut || node),
      },
      {
        label: t("new_folder_with_1_item"),
        action: () => newFolderWithItem(node),
      },
      {
        label: t("move_to_trash"),
        action: () => moveToTrash(shortcut || node),
      },
    ];

    // Remove 'rename' and 'move to trash' options if node is protected
    if (node?.isProtected) {
      options.splice(1, 2);
    }

    return options;
  };

  const getFolderOptions = (
    node: FolderNode | null,
    shortcut?: ShortcutNode,
  ) => {
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
      ...(node?.id === "trash"
        ? [
            {
              label: t("empty_trash"),
              action: () => emptyTrash(),
            },
          ]
        : []),
    ];

    // Remove 'rename', 'move to trash' options if node is protected
    if (node?.isProtected) {
      baseOptions.splice(1, 2);
    }

    if (!shortcut) {
      baseOptions.push(
        { isSeparator: true },
        {
          label: t("new_folder_with_1_item"),
          action: () => newFolderWithItem(node),
        },
        { isSeparator: true },
        ...(node && bookmarks.value.includes(node?.id)
          ? [
              {
                label: t("remove_from_bookmarks"),
                action: () => removeFromBookmarksAction(node),
              },
            ]
          : [
              {
                label: t("add_to_bookmarks"),
                action: () => addToBookmarksAction(node),
              },
            ]),
        {
          label: t("open_in_terminal"),
          action: () => openInTerminal(node),
        },
      );
    }

    return baseOptions;
  };

  const getDockOptions = (node: AppNode | null) => {
    const options = [];

    if (!node) {
      return [];
    }

    // Add open option if app is not open
    if (!node.isOpen) {
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

    // Add quit option if app is open
    if (node.isOpen) {
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

  const getAppOptions = (node: AppNode | null, shortcut?: ShortcutNode) => [
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
    const actualTargetType: ContextMenuTargetType | null = targetType.value;
    const actualTargetNode: Node | null = targetNode.value;

    // Handle shortcuts
    if (
      targetType.value === "shortcut"
      && (targetNode.value as ShortcutNode).targetId
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
        return getDockOptions(actualTargetNode as AppNode);
      case "app":
        return getAppOptions(actualTargetNode as AppNode);
      default:
        return [];
    }
  });

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
