<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { AppNode } from "@/types";
import { storeToRefs } from "pinia";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  app: AppNode;
}>();

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

const { app } = toRefs(props);

const { openedNode, searchQuery } = storeToRefs(useFilesStore());

const filteredItems = computed(() => {
  return openedNode.value?.children.filter((node) => {
    return node.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});
</script>

<template>
  <div
    :class="[
      'grid grid-cols-[minmax(max-content,25%)_1fr] grid-rows-[auto_1fr]',
      'h-full w-full bg-background transition-all duration-300',
      app.isFullscreen ? '' : 'rounded-t-xl',
      !app.isActive ? 'brightness-[0.75]' : '',
    ]"
  >
    <!-- Sidebar -->
    <FilesSidebar
      :style="{ height: `${app.height}px` }"
      :class="[
        'col-start-1 row-span-2 row-start-1 bg-muted',
        app.isFullscreen ? '' : 'rounded-tl-xl',
      ]"
    />

    <!-- Topbar -->
    <FilesTopBar
      @minimize="$emit('minimize')"
      @fullscreen="$emit('fullscreen')"
      @close="$emit('close')"
      :app="app"
      class="app-topbar'col-start-2 row-start-1"
    />

    <!-- Content -->
    <ScrollArea
      class="col-start-2 row-start-2"
      :style="{
        height: `${app.height - 48}px`,
      }"
      @contextmenu.prevent=""
    >
      <div class="grid-wrapper">
        <DesktopNode
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          :isDesktop="false"
        />
      </div>
    </ScrollArea>
  </div>
</template>

<style scoped>
.grid-wrapper {
  @apply grid place-content-start gap-4 p-2;
  @apply grid-cols-[repeat(auto-fill,minmax(90px,1fr))];
}
</style>
