<script setup lang="ts">
import { useMagicKeys } from "@vueuse/core";

definePageMeta({
  pageTransition: false,
});

const { t } = useI18n();
useHead({
  title: computed(() => t("seo.title.booting")),
  meta: [{ name: "description", content: t("seo.description.booting") }],
});

const areSystemLogsVisible = ref(false);

const { escape } = useMagicKeys();

// Toggle the plymouth logs on ESC's key
watch(() => escape!.value, (v) => {
  if (v) {
    areSystemLogsVisible.value = !areSystemLogsVisible.value;
  }
});
</script>

<template>
  <div class="relative grid min-h-svh place-content-center bg-black">
    <Icon
      name="extra:loading-dots"
      size="80"
    />

    <div class="absolute left-2 top-2">
      <p class="font-medium">
        {{ t("press_esc_to_view_system_logs") }}
      </p>
    </div>

    <!-- System Logs on escape -->
    <OverlaySystemLogs v-show="areSystemLogsVisible" />
  </div>
</template>

<style scoped></style>
