<script setup lang="ts">
import { useMagicKeys } from "@vueuse/core";

definePageMeta({
  pageTransition: false,
});

const { t } = useI18n();
useHead({
  title: computed(() => t("seo.title.boot")),
  meta: [{ name: "description", content: t("seo.description.boot") }],
});

const areSystemLogsVisible = ref(false);

const { escape } = useMagicKeys();

// Toggle the plymouth logs on ESC's key
watch(escape, (v) => {
  if (v) {
    areSystemLogsVisible.value = !areSystemLogsVisible.value;
  }
});
</script>

<template>
  <div class="relative grid min-h-[100svh] place-content-center bg-black">
    <Icon name="extra:loading-dots" size="80" />

    <!-- System Logs on escape -->
    <OverlaySystemLogs v-show="areSystemLogsVisible" />
  </div>
</template>

<style scoped></style>
