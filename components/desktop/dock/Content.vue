<script setup lang="ts">
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { animations } from "@formkit/drag-and-drop";
import type { FileSystemNode } from "@/types";
import { until } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";

defineEmits<{
  (e: "close"): void;
}>();

const desktopStore = useDesktopStore();
const { dockApps } = storeToRefs(desktopStore);
const { updateDockApps } = desktopStore;

const dockRef = ref<HTMLElement | null>(null);
const draggableDockItems = computed({
  get: () => dockApps.value,
  set: (newItems: FileSystemNode[]) => {
    updateDockApps(newItems);
  },
});

onBeforeMount(async () => {
  await until(dockRef).toBeTruthy();

  if (!dockRef.value) return;

  dragAndDrop({
    parent: dockRef.value,
    values: draggableDockItems,
    plugins: [animations()],
    sortable: true,
  });
});
</script>

<template>
  <div
    v-on-click-outside="() => $emit('close')"
    ref="dockRef"
    class="grid h-full w-full grid-cols-4 items-center gap-4 rounded-3xl px-3 py-2 sm:flex"
  >
    <DesktopDockApp v-for="app in dockApps" :key="app.id" :app="app" />
  </div>
</template>

<style scoped></style>
