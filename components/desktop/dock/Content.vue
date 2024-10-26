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
const { apps, hasAppsLoading } = storeToRefs(desktopStore);
const { updateDockApps, openApp, minimizeApp } = desktopStore;

const dockRef = ref<HTMLElement | null>(null);
const draggableDockItems = computed({
  get: () => apps.value,
  set: (newItems: AppNode[]) => {
    updateDockApps(newItems);
  },
});

async function handleAppClick(app: AppNode) {
  // If the app is open and not minimized, minimize it
  if (app.isOpen && !app.isMinimized) {
    minimizeApp(app.id);
  } else if (app.isMinimized) {
    openApp(app.id);
  } else {
    hasAppsLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    openApp(app.id);
    hasAppsLoading.value = false;
  }
}

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
    class="z-[50000] grid h-full w-full grid-cols-4 items-center gap-4 rounded-3xl px-3 py-2 sm:flex"
    :class="[hasAppsLoading ? 'cursor-progress' : '']"
  >
    <DesktopDockApp
      v-for="app in apps"
      :key="app.id"
      :app="app"
      @click="() => handleAppClick(app)"
    />
  </div>
</template>

<style scoped></style>
