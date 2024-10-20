<script setup lang="ts">
import { useContextMenuStore } from "@/stores/contextMenu.store";
import { useDesktopStore } from "@/stores/desktop.store";
import { useEventListener } from "@vueuse/core";
import type { FileSystemNode } from "@/types";
import { storeToRefs } from "pinia";

const contextMenuStore = useContextMenuStore();
const desktopStore = useDesktopStore();

const { isOpen, x, y, targetType, targetNode } = storeToRefs(contextMenuStore);
const { closeContextMenu } = contextMenuStore;

const { desktopNode } = storeToRefs(desktopStore);
const { createItem, editItem } = desktopStore;

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
        { label: "New Folder", action: () => createNewFolder() },
        { label: "New Document", action: () => createNewDocument() },
        { isSeparator: true },
        {
          label: "Show Desktop in files",
          action: () => console.log("Show Desktop in files"),
        },
        {
          label: "Change Background...",
          action: () => console.log("Change Background"),
        },
        {
          label: "Display Settings",
          action: () => console.log("Display Settings"),
        },
      ];
    case "file":
      return [
        { label: "Open", action: () => openFile(targetNode.value) },
        { label: "Rename...", action: () => renameNode(targetNode.value) },
        { label: "Move to Trash", action: () => console.log("Move to Trash") },
        { isSeparator: true },
        {
          label: "Properties",
          action: () => console.log("Properties"),
        },
      ];
    case "folder":
      return [
        { label: "Open", action: () => openFolder(targetNode.value) },
        { label: "Rename", action: () => renameNode(targetNode.value) },
        { label: "Move to Trash", action: () => console.log("Move to Trash") },
        { isSeparator: true },
        {
          label: "Compress folder",
          action: () => console.log("Compress 1 folder"),
        },
        {
          label: "New folder with 1 item",
          action: () => console.log("New folder with 1 item"),
        },
        { isSeparator: true },
        {
          label: "Properties",
          action: () => console.log("Properties"),
        },
        {
          label: "Show in Files",
          action: () => console.log("Show in Files"),
        },
      ];
    case "app":
      return [
        { label: "Open", action: () => openApp(targetNode.value) },
        { label: "Pin to Dock", action: () => console.log("Pin to Dock") },
      ];
    default:
      return [];
  }
});

const createNewFolder = () => {
  if (desktopNode.value) {
    createItem(desktopNode.value.id, {
      name: "New Folder",
      type: "folder",
      icon: "folder:folder",
      isRenaming: true,
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
      name: "New File",
      type: "file",
      icon: "file:file",
      isRenaming: true,
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

// TODO: Implement
const renameNode = (node: FileSystemNode | null) => {
  if (node) {
    editItem(node.id, { isRenaming: true });
  }
  
  closeContextMenu();
};

// TODO: Implement
const moveToTrash = (node: FileSystemNode | null) => {
  if (node) {
    console.log(`Moving to Trash: ${node.name}`);
  }
  closeContextMenu();
};
</script>

<template>
  <Teleport to="body">
    <DropdownMenu :open="isOpen">
      <DropdownMenuContent class="!w-56" :style="contextMenuStyle">
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
