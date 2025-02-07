<script setup lang="ts">
import type { AppNode } from "@/types";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  app: AppNode;
}>();

const emit = defineEmits<{
  (e: "openApp", app: AppNode): void;
  (e: "context", event: MouseEvent, app: AppNode): void;
}>();

const { app } = toRefs(props);

function handleClick() {
  emit("openApp", app.value);
}
</script>

<template>
  <DesktopDockItemTooltip
    :app-name="app.name"
    :is-translated="app.isTranslated"
  >
    <Button
      :aria-label="$t('seo.aria.open_app', { app: app.name })"
      variant="ghost"
      size="icon"
      :class="
        cn(
          'group relative grid place-content-center rounded-2xl p-6 duration-0 hover:bg-accent/70 sm:p-7',
          $props.class,
        )
      "
      @contextmenu.prevent="(event) => $emit('context', event, app)"
      @click="handleClick"
    >
      <Icon
        :name="app.icon"
        class="size-9 sm:size-10"
      />
      <div
        v-if="app.isOpen"
        class="absolute bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-white"
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
