<script setup lang="ts">
import { useSwipe, watchDebounced } from "@vueuse/core";

const desktopStore = useDesktopStore();
const { isDockVisible } = storeToRefs(desktopStore);

const dockTriggerRef = ref<HTMLElement | null>(null);

// Handle swipe direction
const { direction } = useSwipe(dockTriggerRef);
watch(direction, (newVal) => {
  if (newVal === "up") {
    isDockVisible.value = true;
  }
});

const isTriggerHovered = ref(false);
const isContentHovered = ref(false);

const isHovered = computed(
  () => isTriggerHovered.value || isContentHovered.value,
);

watchDebounced(
  isHovered,
  (newVal) => {
    isDockVisible.value = newVal;
  },
  { debounce: 50 },
);
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <Tooltip :open="isDockVisible" :default-open="isDockVisible">
      <div
        class="relative"
        @mouseenter="isTriggerHovered = true"
        @mouseleave="isTriggerHovered = false"
      >
        <TooltipTrigger
          ref="dockTriggerRef"
          class="absolute bottom-0 left-0 z-50 h-10 w-full cursor-default transition-all duration-300 sm:h-6"
          @mouseenter="isTriggerHovered = true"
          @mouseleave="isTriggerHovered = false"
        >
        </TooltipTrigger>
        <TooltipContent
          :side-offset="-12"
          class="rounded-3xl p-0"
          @mouseenter="isContentHovered = true"
          @mouseleave="isContentHovered = false"
        >
          <DesktopDockContent @close="isDockVisible = false" />
        </TooltipContent>
      </div>
    </Tooltip>
  </TooltipProvider>
</template>
