<script lang="ts" setup>
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import { animations } from "@formkit/drag-and-drop";
import { useDesktopStore } from "@/stores/desktop.store";
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "desktop",
  middleware: "login",
});

// Initialize the store's nodeMap
const desktopStore = useDesktopStore();
const { desktopItems, maxDesktopGridSlot } = storeToRefs(desktopStore);
const { init } = desktopStore;

init();

// Initialize drag-and-drop with desktop items
const [desktopGridRef, sortableDesktopItems] = useDragAndDrop(desktopItems.value, {
  plugins: [animations()],
});

// Watch for changes in sortableDesktopItems and update the store
watch(
  () => sortableDesktopItems.value,
  (newOrder) => {
    desktopStore.reorderDesktopItems(newOrder);
  },
  { deep: true }
);
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
        v-for="(item, index) in sortableDesktopItems"
        :key="item.id"
        :item="item"
        :class="[index >= maxDesktopGridSlot ? 'hidden' : '']"
      />
    </DesktopGridWrapper>
    <DesktopContextMenu />
  </main>
</template>

<style scoped></style>
