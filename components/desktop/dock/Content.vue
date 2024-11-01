<script setup lang="ts">
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { animations } from "@formkit/drag-and-drop";
import type { AppNode } from "@/types";
import { until } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";

defineEmits<{
  (e: "close"): void;
}>();

const desktopStore = useDesktopStore();
const { apps, hasAppsLoading } =
  storeToRefs(desktopStore);
const { updateDockApps } = desktopStore;

const dockRef = ref<HTMLElement | null>(null);
const draggableDockItems = computed({
  get: () => apps.value,
  set: (newItems: AppNode[]) => {
    updateDockApps(newItems);
  },
});

const { handleOpenApp } = useContextMenu();

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
    class="z-[50000] flex h-full w-full flex-col items-center gap-2 rounded-3xl px-3 py-2 sm:flex-row"
    :class="[hasAppsLoading ? 'cursor-progress' : '']"
  >
    <div
      ref="dockRef"
      class="grid grid-cols-3 place-items-center gap-1 xs:grid-cols-5 sm:flex"
    >
      <DesktopDockItem
        v-for="app in apps"
        :key="app.id"
        :app="app"
        @openApp="() => handleOpenApp(app)"
      />
    </div>
  </div>
</template>

<style scoped></style>
