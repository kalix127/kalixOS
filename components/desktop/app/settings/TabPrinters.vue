<script setup lang="ts">
import type { AppNode } from "@/types";

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);
</script>

<template>
  <DesktopAppSettingsContent :app="app">
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <div class="flex flex-col items-center gap-4 text-center">
        <Icon name="gnome:printers" size="120" class="text-muted-foreground" />
        <span class="text-2xl font-extrabold">{{
          $t("no_print_service")
        }}</span>
        <p class="text-sm text-muted-foreground">
          {{ $t("no_print_service_description") }}
        </p>
      </div>
    </div>
  </DesktopAppSettingsContent>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>