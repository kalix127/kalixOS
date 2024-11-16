<script setup lang="ts">
import { useSwipe, watchDebounced, useDebounceFn } from "@vueuse/core";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
const desktopStore = useDesktopStore();
const { isDockVisible, isDockPinned, openApps } = storeToRefs(desktopStore);

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
const isMobile = useBreakpoints(breakpointsTailwind).smaller("sm");

const isHovered = computed(
  () => isTriggerHovered.value || isContentHovered.value,
);

const setVisibility = useDebounceFn((value: boolean) => {
  if (isDockPinned.value) return;
  isDockVisible.value = value;
}, 100);

watchDebounced(
  isHovered,
  (newVal) => {
    isDockVisible.value = newVal;
  },
  { debounce: 100 },
);
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <Tooltip :open="isDockVisible" :default-open="isDockVisible">
      <div class="relative">
        <TooltipTrigger
          ref="dockTriggerRef"
          class="absolute bottom-0 left-0 z-[50000] h-10 w-full cursor-default sm:h-6"
          @mouseenter="() => setVisibility(true)"
          @mouseleave="() => setVisibility(false)"
        >
        </TooltipTrigger>
        <TooltipContent
          v-if="!isMobile || (isMobile && openApps.length === 0)"
          :side-offset="-12"
          class="z-[50000] rounded-3xl p-0"
          @mouseenter="() => setVisibility(true)"
          @mouseleave="() => setVisibility(false)"
        >
          <DesktopDockContent @close="() => setVisibility(false)" />
        </TooltipContent>
      </div>
    </Tooltip>
  </TooltipProvider>
</template>
