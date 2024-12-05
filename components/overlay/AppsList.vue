<script lang="ts" setup>
import type { AppNode } from "@/types";
import { useMagicKeys } from "@vueuse/core";
import { defaultApps } from "@/constants";

const { isShowAppsOverlayVisible } = storeToRefs(useDesktopStore());
const { handleOpenApp: openApp } = useContextMenu();

const query = ref("");

const { escape } = useMagicKeys();

// Close the overlay on 'ESC' key
watch(escape, (v) => {
  if (v) {
    closeOverlay();
  }
});

const filteredApps = computed(() => {
  return defaultApps
    .slice(0, -1)
    .filter(
      (app) =>
        app.id !== "kate" &&
        app.type !== "social" &&
        app.name.toLowerCase().includes(query.value),
    );
});

function handleOpenApp(app: AppNode) {
  closeOverlay();
  openApp(app);
}

function closeOverlay() {
  isShowAppsOverlayVisible.value = false;
}
</script>

<template>
  <div
    class="absolute left-0 top-0 z-[40000] flex h-[100svh] w-[100svw] flex-col items-center gap-10 bg-muted py-14 transition-opacity duration-500 lg:px-20 lg:py-20"
    @click="closeOverlay"
  >
    <!-- Filter apps  -->
    <div class="relative flex items-center gap-4" @click.stop="">
      <div class="absolute inset-y-0 start-0 grid place-content-center px-3">
        <Icon name="gnome:search" size="20" class="text-[#b3b2b2]" />
      </div>
      <Input
        class="min-w-72 rounded-full bg-secondary pl-10 focus-visible:ring-0"
        v-model="query"
      />
    </div>

    <!-- Apps list -->
    <div class="flex flex-wrap justify-center gap-4" @contextmenu.prevent="">
      <TransitionGroup name="apps">
        <div
          class="flex size-36 select-none flex-col items-center justify-center gap-2 rounded-3xl transition-colors duration-300 hover:bg-popover"
          v-for="app in filteredApps"
          :key="app.id"
          @click.stop="() => handleOpenApp(app)"
        >
          <Icon :name="app.icon" size="65" />
          <span class="text-sm">
            {{ app.isTranslated ? $t(app.name) : app.name }}
          </span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.apps-enter-active,
.apps-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.apps-enter-from,
.apps-leave-to {
  opacity: 0;
}
</style>
