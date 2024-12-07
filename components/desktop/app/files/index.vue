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

</script>

<template>
  <div
    :class="[
      'grid h-full w-full bg-background',
      // Mobile grid: single column
      'grid-cols-1 grid-rows-[auto_1fr_1fr]',
      // Desktop grid: two columns, two rows
      'md:grid-cols-[minmax(max-content,25%)_1fr] md:grid-rows-[auto_1fr]',
      app.isFullscreen ? '' : 'rounded-t-xl',
    ]"
  >
    <!-- Sidebar -->
    <FilesSidebar
      :style="{ height: `${app.height}px` }"
      :class="[
        'bg-muted',
        // Mobile: sidebar in row 2
        'col-span-1 row-start-2',
        // Desktop: sidebar spans rows 1-2 in column 1
        'md:col-start-1 md:row-span-2 md:row-start-1',

        app.isFullscreen ? '' : 'rounded-tl-xl',
      ]"
    />

    <!-- Topbar -->
    <FilesTopBar
      @minimize="$emit('minimize')"
      @fullscreen="$emit('fullscreen')"
      @close="$emit('close')"
      :app="app"
      :class="[
        'app-topbar',
        // Mobile: topbar in row 1
        'col-span-1 row-start-1',
        // Desktop: topbar in column 2, row 1
        'md:col-start-2 md:row-start-1',
      ]"
    />

    <!-- Content -->
    <div
      :class="[
        'flex flex-col items-center justify-start',
        // Mobile: content in row 3
        'col-span-1 row-start-3',
        // Desktop: content in column 2, row 2
        'md:col-start-2 md:row-start-2',
      ]"
      :style="{ height: `${app.height - 40}px` }"
    >

    </div>
  </div>
</template>

<style scoped></style>
