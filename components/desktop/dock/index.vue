<script setup lang="ts">
import { useSwipe, watchDebounced } from "@vueuse/core";

const desktopStore = useDesktopStore();
const { isDockVisible, isDockPinned } = storeToRefs(desktopStore);

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

function toggleVisibility(value: boolean) {
  if (isDockPinned.value) return;
  isDockVisible.value = value;
}

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
        @mouseenter="() => toggleVisibility(true)"
        @mouseleave="() => toggleVisibility(false)"
      >
        <TooltipTrigger
          ref="dockTriggerRef"
          class="absolute bottom-0 left-0 z-[50000] h-10 w-full cursor-default sm:h-6"
          @mouseenter="() => toggleVisibility(true)"
          @mouseleave="() => toggleVisibility(false)"
        >
        </TooltipTrigger>
        <TooltipContent
          :side-offset="-12"
          class="z-[50000] rounded-3xl p-0"
          @mouseenter="() => toggleVisibility(true)"
          @mouseleave="() => toggleVisibility(false)"
        >
          <DesktopDockContent
            @close="() => toggleVisibility(false)"
          />
        </TooltipContent>
      </div>
    </Tooltip>
  </TooltipProvider>
</template>
