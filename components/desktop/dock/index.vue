<script setup lang="ts">
import {
  useSwipe,
  watchDebounced,
  useDebounceFn,
  breakpointsTailwind,
  useBreakpoints,
} from "@vueuse/core";
const desktopStore = useDesktopStore();
const { isDockVisible, isDockPinned, hasAppFullscreen } =
  storeToRefs(desktopStore);

const dockTriggerRef = ref<HTMLElement | null>(null);
const { openApp } = useDesktopStore();
const isDesktop = useBreakpoints(breakpointsTailwind).greaterOrEqual("lg");

// Handle swipe direction
const { direction } = useSwipe(dockTriggerRef);
watch(direction, (newVal) => {
  if (newVal === "up") {
    isDockVisible.value = true;
  }
});

const setVisibility = (value: boolean) => {
  if (hasAppFullscreen.value) {
    isDockPinned.value = false;
  }
  isDockVisible.value = true;
};

// Hide the dock when an app is fullscreen, but still show on hover
watchDebounced(
  hasAppFullscreen,
  (newVal) => {
    if (newVal) {
      isDockVisible.value = false;
    }
  },
  { debounce: 100 },
);

// Open terminal on mount
onMounted(() => {
  if (isDesktop.value) {
    openApp("terminal");
  }
});
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
