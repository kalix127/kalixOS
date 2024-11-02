<script setup lang="ts">
import { useMagicKeys } from "@vueuse/core";

definePageMeta({
  pageTransition: false,
});

const areSystemLogsVisible = ref(false);

const { escape } = useMagicKeys();

watch(escape, (v) => {
  if (v) {
    areSystemLogsVisible.value = !areSystemLogsVisible.value;
  }
});
</script>

<template>
  <div class="relative grid min-h-[100svh] grid-rows-[1fr_75px] bg-black">
    <div class="flex flex-col items-center justify-center">
      <Icon name="extra:loading-dots" size="80" />
    </div>

    <div class="grid place-content-center">
      <div class="flex items-center gap-2">
        <Icon name="logo:manjaro" size="46" />
        <span class="font-comfortaa select-none text-3xl font-bold sm:text-4xl"
          >manjaro</span
        >
      </div>
    </div>

    <!-- System Logs on escape -->
    <OverlaySystemLogs v-show="areSystemLogsVisible" />
  </div>
</template>

<style scoped></style>
