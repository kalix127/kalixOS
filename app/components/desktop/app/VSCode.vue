<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

defineProps<{
  class?: HTMLAttributes["class"];
}>();

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

const { repositoryVscodeUrl } = useRuntimeConfig().public;
</script>

<template>
  <div class="grid size-full grid-rows-[40px_1fr]">
    <!-- Top bar -->
    <DesktopWindowTopBar
      @minimize="() => $emit('minimize')"
      @fullscreen="() => $emit('fullscreen')"
      @close="() => $emit('close')"
    />

    <!-- VsCode -->
    <iframe
      :src="repositoryVscodeUrl"
      :class="cn('h-full w-full bg-background', $props.class)"
      sandbox="allow-scripts allow-same-origin allow-forms"
      referrerpolicy="no-referrer"
      width="100%"
      height="100%"
      loading="lazy"
      title="VS Code"
    />
  </div>
</template>

<style scoped></style>
