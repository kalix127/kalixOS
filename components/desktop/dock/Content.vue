<script setup lang="ts">
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { animations } from "@formkit/drag-and-drop";
import type { AppNode } from "@/types";
import { until, breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";

defineEmits<{
  (e: "close"): void;
}>();

const desktopStore = useDesktopStore();
const { apps, isShowAppsOverlayVisible } = storeToRefs(desktopStore);
const { updateDockApps } = desktopStore;

const { openContextMenu } = useContextMenuStore();

const dockRef = ref<HTMLElement | null>(null);
const draggableDockItems = computed({
  get: () => apps.value,
  set: (newItems: AppNode[]) => {
    updateDockApps(newItems);
  },
});

const isMobileOrTablet = useBreakpoints(breakpointsTailwind).smaller("lg");

const { openApp } = useDesktopStore();

const handleContextMenu = (event: MouseEvent, app: AppNode) => {
  if (app.id === "show-apps") return;
  openContextMenu(event.clientX, event.clientY, "dock", app, false);
};

const handleOpenApp = (app: AppNode) => {
  // Toggle the apps list overlay
  if (app.id === "show-apps") {
    isShowAppsOverlayVisible.value = !isShowAppsOverlayVisible.value;
    return;
  }

  openApp(app.id, true);
};

onBeforeMount(async () => {
  await until(dockRef).toBeTruthy();

  if (!dockRef.value) return;

  dragAndDrop({
    parent: dockRef.value,
    values: draggableDockItems,
    plugins: [animations()],
    sortable: true,
    disabled: isMobileOrTablet.value,
  });
});
</script>

<template>
  <div
    v-on-click-outside="() => $emit('close')"
    class="z-[50000] flex h-full w-full flex-col items-center gap-2 rounded-3xl px-3 py-2 sm:flex-row"
  >
    <div
      ref="dockRef"
      class="grid grid-cols-4 place-items-center gap-1 sm:flex"
    >
      <DesktopDockItem
        v-for="app in apps"
        :key="app.id"
        :app="app"
        @openApp="handleOpenApp"
        @context="handleContextMenu"
        :class="[app.id === 'kate' ? 'hidden' : '']"
      />
    </div>
  </div>
</template>

<style scoped></style>
