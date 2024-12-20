<script lang="ts" setup>
import type { AppNode } from "@/types";
import { defaultApps } from "@/constants";
import { useMagicKeys } from "@vueuse/core";

const { isShowAppsOverlayVisible } = storeToRefs(useDesktopStore());
const { openApp } = useDesktopStore();

const query = ref("");

const { escape } = useMagicKeys();

// Close the overlay on 'ESC' key
watch(() => escape!.value, (v: boolean) => {
  if (v) {
    closeOverlay();
  }
});

const filteredApps = computed(() => {
  return defaultApps
    .slice(0, -1)
    .filter(
      app =>
        app.id !== "kate"
        && app.name.toLowerCase().includes(query.value),
    );
});

function handleOpenApp(app: AppNode) {
  closeOverlay();
  openApp(app.id);
}

function closeOverlay() {
  isShowAppsOverlayVisible.value = false;
}
</script>

<template>
  <div
    class="absolute left-0 top-0 z-[40000] flex h-svh w-svw flex-col items-center gap-10 bg-muted py-14 transition-opacity duration-500 lg:p-20"
    @click="closeOverlay"
  >
    <!-- Filter apps  -->
    <div
      class="relative flex items-center gap-4"
      @click.stop=""
    >
      <div class="absolute inset-y-0 start-0 grid place-content-center px-3">
        <Icon
          name="gnome:search"
          size="20"
          class="text-[#b3b2b2]"
        />
      </div>
      <Input
        id="search-apps"
        v-model="query"
        class="min-w-72 rounded-full bg-secondary pl-10 focus-visible:ring-0"
      />
    </div>

    <!-- Apps list -->
    <div
      class="flex flex-wrap justify-center gap-4"
      @contextmenu.prevent=""
    >
      <TransitionGroup name="apps">
        <div
          v-for="app in filteredApps"
          :key="app.id"
          class="flex size-36 select-none flex-col items-center justify-center gap-2 rounded-3xl transition-colors duration-300 hover:bg-popover"
          @click.stop="() => handleOpenApp(app)"
        >
          <Icon :name="app.icon" size="65" />
          <span class="text-sm font-medium">
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
