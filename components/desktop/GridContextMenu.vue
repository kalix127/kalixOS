<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import type { FileSystemNode, AppNode } from "@/types";

const { t } = useI18n();

const contextMenuStore = useContextMenuStore();
const desktopStore = useDesktopStore();

const { isOpen, x, y, targetType, targetNode } = storeToRefs(contextMenuStore);
const { closeContextMenu } = contextMenuStore;

const { desktopNode, trashNode } = storeToRefs(desktopStore);
const { createItem, editItem, moveItem, addToBookmarks } = desktopStore;

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
      return [{ label: t("open"), action: () => openApp(targetNode.value) }];

    case "dock":
      return [
        // Show "Open" option only if the app is closed
        ...(targetNode.value.isOpen
          ? []
          : [
              { label: t("open"), action: () => openApp(targetNode.value) },
            ]),
        // Show "App Details" option only if the app is a social app
        ...(targetNode.value?.type === "social"
          ? []
          : [
            { isSeparator: true },
              {
                label: t("app_details"),
                action: () => console.log("App Details"),
              },
            ]),

        // Show "Quit" option only if the app is open
        ...(targetNode.value?.isOpen
          ? [
              { isSeparator: true },
              { label: t("quit"), action: () => console.log("Quit") },
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
      isNewlyCreated: true,
      children: [],
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
      children: [],
    });
  }
  closeContextMenu();
};

// TODO: Implement
const openApp = (node: FileSystemNode | AppNode | null) => {
  if (node) {
    console.log(`Launching app: ${node.name}`);
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
</script>

<template>
  <Teleport to="body">
    <DropdownMenu :open="isOpen">
      <DropdownMenuContent
        class="z-[60000]"
        :class="[targetType === 'dock' ? '!w-60 sm:max-h-60' : '!w-72']"
        :style="contextMenuStyle"
      >
        <div class="space-y-2">
          <!-- Target name -->
          <div
            v-if="targetType === 'dock'"
            class="flex items-center gap-4 px-1"
          >
            <span
              class="select-none text-nowrap text-xs font-extrabold text-muted-foreground"
            >
              {{ $t(targetNode?.name) }}
            </span>
            <div class="h-px w-full bg-gray-50/10"></div>
          </div>

          <!-- Options -->
          <template v-for="option in menuOptions" :key="option.label">
            <DropdownMenuSeparator v-if="option.isSeparator" />
            <DropdownMenuItem
              @click="option.action"
              :inset="targetType !== 'dock'"
              class="duration-0"
              :class="[targetType === 'dock' ? 'min-h-9' : '']"
              v-else
            >
              {{ option.label }}
            </DropdownMenuItem>
          </template>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  </Teleport>
</template>

<style scoped></style>
