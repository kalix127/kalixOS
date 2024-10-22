<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useEventListener } from "@vueuse/core";

const contextMenuStore = useContextMenuStore();
const { openContextMenu } = contextMenuStore;

const desktopStore = useDesktopStore();
const { maxDesktopGridSlot } = storeToRefs(desktopStore);

const desktopGridRef = ref<HTMLElement | null>(null);

defineExpose({
  desktopGridRef,
});

const handleContextMenu = (event: MouseEvent) => {
  openContextMenu(event.clientX, event.clientY, "desktop");
};

function countGridSlots(el: HTMLElement | null): number {
  if (!el) return 0;

  const style = getComputedStyle(el);

  const rows = style.getPropertyValue("grid-template-rows").split(" ").length;
  const columns = style
    .getPropertyValue("grid-template-columns")
    .split(" ").length;

  return columns * rows;
}

const updateGridSlotCount = () => {
  maxDesktopGridSlot.value = countGridSlots(desktopGridRef.value);
};

useEventListener("resize", updateGridSlotCount);

onMounted(() => {
  updateGridSlotCount();
});
</script>

<template>
  <div
    ref="desktopGridRef"
    @contextmenu.prevent="handleContextMenu"
    class="desktop-grid-wrapper z-[2] h-full w-full px-4 py-2 md:px-6"
  >
    <slot />
  </div>
</template>

<style scoped>
.desktop-grid-wrapper {
  @apply grid gap-6;

  @apply grid-cols-[repeat(auto-fill,minmax(100px,1fr))];

  grid-template-rows: repeat(auto-fit, 110px);
  
  max-height: calc(100vh - 35px);
}
</style>
