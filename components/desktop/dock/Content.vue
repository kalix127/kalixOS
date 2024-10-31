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
const { apps, hasAppsLoading, isDockPinned, isDockVisible } =
  storeToRefs(desktopStore);
const { updateDockApps, openApp, toggleMinimizeApp } = desktopStore;

const dockRef = ref<HTMLElement | null>(null);
const draggableDockItems = computed({
  get: () => apps.value,
  set: (newItems: AppNode[]) => {
    updateDockApps(newItems);
  },
});

async function handleAppClick(app: AppNode) {
  if (!isDockPinned.value) {
    isDockVisible.value = false;
  }

  // If the app is a social app, open the corresponding URL
  if (app.type === "social") {
    const { linkedin, github } = useRuntimeConfig().public.socialUrl;
    const url = app.id === "linkedin" ? linkedin : github;
    if (url) {
      window.open(url as string, "_blank");
    }
    return;
  }

  // If the app is not open, open it with delay
  if (!app.isOpen) {
    hasAppsLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    openApp(app.id);
    hasAppsLoading.value = false;
    return;
  } else {
    toggleMinimizeApp(app.id);
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
        :app-name="app.name"
        :icon="app.icon"
        :is-open="app.isOpen"
        @click="() => handleAppClick(app)"
      />
    </div>
  </div>
</template>

<style scoped></style>
