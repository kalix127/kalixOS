<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import type { FileSystemNode } from "@/types";

const { t } = useI18n();

const contextMenuStore = useContextMenuStore();
const desktopStore = useDesktopStore();

const { isOpen, x, y, targetType, targetNode } = storeToRefs(contextMenuStore);
const { closeContextMenu } = contextMenuStore;

const { desktopNode, trashNode } = storeToRefs(desktopStore);
const { createItem, editItem, moveItem } = desktopStore;

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
        { label: t("desktop.new_folder"), action: () => createNewFolder() },
        { label: t("desktop.new_document"), action: () => createNewDocument() },
        { isSeparator: true },
        {
          label: `${t("desktop.change_background")}...`,
          action: () => console.log("Change Background"),
        },
        {
          label: t("desktop.display_settings"),
          action: () => console.log("Display Settings"),
        },
      ];
    case "file":
      return [
        { label: "Open", action: () => openFile(targetNode.value) },
        { label: `${t("desktop.rename")}...`, action: () => renameNode(targetNode.value) },
        { label: t("desktop.move_to_trash"), action: () => moveToTrash(targetNode.value) },
        { isSeparator: true },
        {
          label: t("desktop.properties"),
          action: () => console.log("Properties"),
        },
      ];
    case "folder":
      return [
        { label: t("desktop.open"), action: () => openFolder(targetNode.value) },
        { label: `${t("desktop.rename")}...`, action: () => renameNode(targetNode.value) },
        { label: t("desktop.move_to_trash"), action: () => moveToTrash(targetNode.value) },
        { isSeparator: true },
        {
          label: t("desktop.compress_folder"),
          action: () => console.log("Compress 1 folder"),
        },
        {
          label: t("desktop.new_folder_with_1_item"),
          action: () => console.log("New folder with 1 item"),
        },
        { isSeparator: true },
        {
          label: t("desktop.properties"),
          action: () => console.log("Properties"),
        },
        {
          label: t("desktop.show_x_in_files", { target: t("desktop.folder") }),
          action: () => console.log("Show in Files"),
        },
      ];
    case "app":
      return [
        { label: t("desktop.open"), action: () => openApp(targetNode.value) },
      ];
    default:
      return [];
  }
});

const createNewFolder = () => {
  if (desktopNode.value) {
    createItem(desktopNode.value.id, {
      name: t("desktop.new_folder"),
      type: "folder",
      icon: "folder:folder",
      isRenaming: true,
      isNewlyCreated: true,
      children: [],
    });
  } else {
    console.error("Desktop node not found.");
  }
  closeContextMenu();
};

const createNewDocument = () => {
  if (desktopNode.value) {
    createItem(desktopNode.value.id, {
      name: t("desktop.new_document"),
      type: "file",
      icon: "file:file",
      isRenaming: true,
      isNewlyCreated: true,
      children: [],
    });
  } else {
    console.error("Desktop node not found.");
  }
  closeContextMenu();
};

// TODO: Implement
const openApp = (node: FileSystemNode | null) => {
  if (node) {
    console.log(`Launching app: ${node.name}`);
  }
  closeContextMenu();
};

// TODO: Implement
const openFolder = (node: FileSystemNode | null) => {
  if (node) {
    console.log(`Opening folder: ${node.name}`);
  }
  closeContextMenu();
};

// TODO: Implement
const openFile = (node: FileSystemNode | null) => {
  if (node) {
    console.log(`Opening file: ${node.name}`);
  }
  closeContextMenu();
};

const renameNode = (node: FileSystemNode | null) => {
  if (node) {
    editItem(node.id, { isRenaming: true });
  }
  closeContextMenu();
};

const moveToTrash = (node: FileSystemNode | null) => {
  if (node && trashNode.value) {
    moveItem(node.id, trashNode.value.id);
  }
  closeContextMenu();
};
</script>

<template>
  <Teleport to="body">
    <DropdownMenu :open="isOpen">
      <DropdownMenuContent class="!w-72 z-[50000]" :style="contextMenuStyle">
        <template v-for="option in menuOptions" :key="option.label">
          <DropdownMenuSeparator v-if="option.isSeparator" />
          <DropdownMenuItem
            @click="option.action"
            inset
            class="duration-0"
            v-else
          >
            {{ option.label }}
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenu>
  </Teleport>
</template>

<style scoped></style>
