<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { AppNode } from "@/types";
import { cn } from "@/lib/utils";

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
</script>

<template>
  <div class="grid h-full w-full grid-rows-[40px_1fr]">
    <!-- Top bar -->
    <DesktopWindowTopBar
      @minimize="$emit('minimize')"
      @fullscreen="$emit('fullscreen')"
      @close="$emit('close')"
      :app="app"
    />

    <!-- Brave -->
    <iframe
      src="https://www.google.com/webhp?igu=1"
      :class="cn('h-full w-full bg-background', $props.class)"
      sandbox="allow-scripts allow-same-origin allow-forms"
      referrerpolicy="no-referrer"
      loading="lazy"
      width="100%"
      height="100%"
      allow="clipboard-read; clipboard-write;"
      title="Brave"
    ></iframe>
  </div>
</template>

<style scoped></style>
