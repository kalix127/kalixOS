<script setup lang="ts">
import { type AppNode } from "@/types";

const { hasAppsLoading } = storeToRefs(useDesktopStore());

defineEmits<{
  (e: "openApp", app: AppNode): void;
  (e: "context", event: MouseEvent, app: AppNode): void;
}>();

const props = defineProps<{
  app: AppNode;
}>();
const { app } = toRefs(props);
</script>

<template>
  <DesktopDockItemTooltip :app-name="app.name">
    <Button
      @contextmenu.prevent="(event) => $emit('context', event, app)"
      @click="() => $emit('openApp', app)"
      variant="ghost"
      size="icon"
      class="relative grid cursor-default place-content-center rounded-2xl p-6 duration-0 hover:bg-accent/70 sm:p-7"
      :class="[hasAppsLoading ? 'cursor-progress' : '']"
    >
      <Icon :name="app.icon" class="size-9 sm:size-10" />
      <div
        v-if="app.isOpen"
        class="absolute bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white"
      />
    </Button>
  </DesktopDockItemTooltip>
</template>

<style scoped></style>
