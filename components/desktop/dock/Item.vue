<script setup lang="ts">
import { type AppNode } from "@/types";

const { hasAppsLoading } = storeToRefs(useDesktopStore());

const emit = defineEmits<{
  (e: "openApp", app: AppNode): void;
  (e: "context", event: MouseEvent, app: AppNode): void;
}>();

const props = defineProps<{
  app: AppNode;
}>();
const { app } = toRefs(props);

function handleClick() {
  emit("openApp", app.value);

  if (app.value.isOpen) return;
}
</script>

<template>
  <DesktopDockItemTooltip :app-name="app.name" :is-translated="app.isTranslated">
    <Button
      @contextmenu.prevent="(event) => $emit('context', event, app)"
      @click="handleClick"
      variant="ghost"
      size="icon"
      class="group relative grid place-content-center rounded-2xl p-6 duration-0 hover:bg-accent/70 sm:p-7"
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

<style scoped>
.launch-enter-active {
  animation: launch 0.3s ease;
}

@keyframes launch {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.launch-enter-from,
.launch-leave-to {
  opacity: 0;
  transform: scale(1);
}

/* Utility class to prevent flicker */
.prevent-flicker {
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
