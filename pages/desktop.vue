<script lang="ts" setup>
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import type { FileSystemNode } from "@/types";
import { useDesktopStore } from "@/stores/desktop.store";
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "desktop",
  middleware: "login",
});

const desktopStore = useDesktopStore();
const { desktopItems, maxDesktopGridSlot } = storeToRefs(desktopStore);
const { init, moveItem, updateDesktopItems } = desktopStore;

const desktopGridRef = ref<HTMLElement | null>(null);
const draggableItems = computed({
  get: () => desktopItems.value,
  set: (newItems: FileSystemNode[]) => {
    updateDesktopItems(newItems);
  },
});

onMounted(() => {
  // Initialize the FileSystem
  init();

  if (!desktopGridRef.value) {
    return;
  }

  // Initialize drag-and-drop
  dragAndDrop({
    parent: desktopGridRef.value,
    values: draggableItems,
    sortable: false,
    handleNodeDrop(data, state) {
      const draggedNode: FileSystemNode = state.draggedNode.data.value;
      if (!draggedNode) {
        return;
      }

      // Check if the dragged node is the trash
      if (draggedNode.name === "Trash") {
        return;
      }

      const targetNode: FileSystemNode = data.targetData.node.data.value;
      if (!targetNode) {
        return;
      }

      // Move the item
      if (targetNode) {
        moveItem(draggedNode.id, targetNode.id);
      }
    },
  });
});
</script>

<template>
  <main class="relative">
    <!-- Background image -->
    <NuxtImg
      src="/img/bg-desktop.jpg"
      class="absolute -z-[1] h-full w-full object-cover"
      style="-webkit-user-drag: none"
      :placeholder="true"
    />
    <!-- Desktop grid wrapper -->
    <DesktopGridWrapper ref="desktopGridRef">
      <DesktopGridCell
        v-for="(item, index) in desktopItems"
        :key="item.id"
        :item="item"
        :class="[index >= maxDesktopGridSlot ? 'hidden' : '']"
      />
    </DesktopGridWrapper>
    <DesktopContextMenu />
  </main>
</template>

<style scoped></style>
