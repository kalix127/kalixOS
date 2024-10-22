<script setup lang="ts">
import { useMagicKeys } from "@vueuse/core";

definePageMeta({
  pageTransition: false,
})

const areSystemLogsVisible = ref(false);

const { escape } = useMagicKeys();

watch(escape, (v) => {
  if (v) {
    areSystemLogsVisible.value = !areSystemLogsVisible.value;
  }
});
</script>

<template>
  <div class="grid min-h-[100vh] grid-rows-[90%_10%] bg-black relative">
    <div class="flex flex-col items-center justify-center">
      <LogoAsusRog class="size-48" />
      <Icon name="eos-icons:three-dots-loading" size="80" />
    </div>

    <div class="grid place-content-center">
      <LogoManjaroFull class="max-w-48" />
    </div>

    <!-- System Logs on escape -->
    <OverlaySystemLogs v-show="areSystemLogsVisible"  />
  </div>
</template>

<style scoped></style>
