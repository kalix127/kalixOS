<script setup lang="ts">
import type { AppNode } from "@/types";
import VueDraggableResizable from "vue-draggable-resizable";
import {
  breakpointsTailwind,
  useBreakpoints,
  useEventListener,
  useWindowSize as useViewportSize,
} from "@vueuse/core";

const desktopStore = useDesktopStore();
const { desktopRef } = storeToRefs(desktopStore);
storeToRefs(desktopStore);
const { closeApp, toggleMinimizeApp } = desktopStore;

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const appRef = ref<InstanceType<typeof VueDraggableResizable>>();

const { minWindowSizes } = useWindowSizes();
const { width, height } = useViewportSize();

const {
  handleActive,
  handleDragStop,
  handleDragging,
  handleResizeStop,
  handleFullscreen,
} = useWindowHandlers(app, appRef);

watch([width, height], ([newWidth, newHeight]) => {
  // If the app is fullscreen, make sure the app's sizes are locked
  if (app.value.isFullscreen) {
    app.value.width = newWidth;
    app.value.height = newHeight;
    return;
  }

  // Check if the app's sizes are bigger than the viewport size, if they arent update the app's sizes do the max value in the viewport
  if (app.value.width > newWidth) {
    app.value.width = newWidth;
  }
  if (app.value.height > newHeight) {
    app.value.height = newHeight;
  }
});

// Make sure the modal is closed by default
onBeforeMount(() => {
  app.value.isModalOpen = false;

  // If on mobile, set the app to fullscreen
  const isMobileOrTablet = useBreakpoints(breakpointsTailwind).smaller("sm");
  if (isMobileOrTablet.value) {
    handleFullscreen(true);
  }
});
</script>

<template>
  <vue-draggable-resizable
    ref="appRef"
    :min-width="minWindowSizes.minWidth"
    :min-height="minWindowSizes.minHeight"
    :w="app.width"
    :h="app.height"
    :x="app.x"
    :y="app.y"
    :active="app.isActive"
    :resizable="app.isFullscreen || app.isModalOpen ? false : true"
    :draggable="app.isFullscreen ? false : true"
    :parent="true"
    @dragging="handleDragging"
    @dragStop="handleDragStop"
    @resizing="handleResizeStop"
    @resizeStop="handleResizeStop"
    @activated="() => handleActive(true)"
    @deactivated="() => handleActive(false)"
    @click="() => handleActive(true)"
    dragHandle=".app-topbar"
    classNameHandle="handle"
    classNameDragging="app-dragging"
    classNameResizing="app-resizing"
    :style="{
      zIndex: app.isActive ? 10000 : 5000,
    }"
    class="absolute left-0 top-0 rounded-t-xl !border-none shadow-xl duration-300"
    :class="[app.isFullscreen ? '' : 'rounded-t-xl']"
  >
    <div :id="app.id" class="relative grid h-full w-full grid-rows-[40px_1fr]">
      <!-- Top bar -->
      <DesktopWindowTopBar
        @minimize="() => toggleMinimizeApp(app.id)"
        @fullscreen="handleFullscreen()"
        @close="() => closeApp(app.id)"
        :app="app"
        :class="[
          app.isModalOpen ? 'pointer-events-none brightness-[0.8]' : '',
          app.isActive ? 'bg-popover' : 'bg-muted',
        ]"
        class="app-topbar"
      />

      <!-- Content -->
      <Settings v-if="app.id === 'settings'" :app="app" />
    </div>
  </vue-draggable-resizable>
</template>

<style>
@import "vue-draggable-resizable/style.css";

.app-dragging {
  @apply duration-0;
}

.app-resizing {
  @apply duration-0;
}

.handle {
  @apply z-10 !block h-1 w-1 border-none bg-transparent sm:h-2 sm:w-2;
}

/* Top */
.handle-tl {
  @apply left-1 top-1;
}

.handle-tm {
  @apply left-4 top-0 w-[calc(100%-22px)];
}

.handle-tr {
  @apply right-1 top-1;
}

/* Middle */

.handle-ml {
  @apply left-0 top-4 h-[calc(100%-18px)];
}

.handle-mr {
  @apply right-0 top-4 h-[calc(100%-18px)];
}

/* Bottom */
.handle-bl {
  @apply bottom-0 left-0;
}

.handle-bm {
  @apply bottom-0 left-3 w-[calc(100%-13px)];
}

.handle-br {
  @apply bottom-0 right-0;
}
</style>
