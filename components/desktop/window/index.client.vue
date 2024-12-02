<script setup lang="ts">
import type { Component } from "vue";
import type { AppNode } from "@/types";
import VueDraggableResizable from "vue-draggable-resizable";
import {
  breakpointsTailwind,
  useBreakpoints,
  useWindowSize as useViewportSize,
} from "@vueuse/core";
import { defaultFullscreenApps } from "@/constants";

const desktopStore = useDesktopStore();
const { closeApp, toggleMinimizeApp } = desktopStore;

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const appRef = ref<InstanceType<typeof VueDraggableResizable>>();

const { minWindowSizes } = useWindowSizes();
const { width, height } = useViewportSize();

const isMobile = useBreakpoints(breakpointsTailwind).smaller("sm");

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

  // If on mobile or brave, set the app to fullscreen
  if (isMobile.value || defaultFullscreenApps.includes(app.value.id)) {
    handleFullscreen(true);
  }
});

import Settings from "@/components/desktop/app/settings/index.vue";
import DesktopAppVSCode from "@/components/desktop/app/VSCode.vue";
import DesktopAppBrave from "@/components/desktop/app/Brave.vue";
import DesktopAppTerminal from "@/components/desktop/app/Terminal.vue";
import DesktopAppKate from "@/components/desktop/app/Kate.vue";
import DesktopAppFiles from "@/components/desktop/app/files/index.vue";

const appComponents: { [appId: string]: Component } = {
  settings: Settings,
  code: DesktopAppVSCode,
  brave: DesktopAppBrave,
  terminal: DesktopAppTerminal,
  kate: DesktopAppKate,
  files: DesktopAppFiles,
};

const getAppComponent = (appId: string): Component => {
  return appComponents[appId] || null;
};
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
    :resizable="!app.isFullscreen && !app.isModalOpen"
    :draggable="!app.isFullscreen"
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
    :style="{ zIndex: app.isActive ? 10000 : 5000 }"
    class="absolute left-0 top-0 !border-none duration-300"
    :class="[
      app.isFullscreen ? '' : 'rounded-t-xl',
      app.isActive
        ? 'shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]'
        : 'shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)]',
    ]"
  >
    <div :id="app.id" class="relative h-full w-full">
      <component
        :is="getAppComponent(app.id)"
        :app="app"
        @minimize="() => toggleMinimizeApp(app.id)"
        @fullscreen="() => handleFullscreen()"
        @close="() => closeApp(app.id)"
      />
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

.handle-tl {
  @apply left-1 top-1;
}

.handle-tm {
  @apply left-4 top-0 w-[calc(100%-22px)];
}

.handle-tr {
  @apply right-1 top-1;
}

.handle-ml {
  @apply left-0 top-4 h-[calc(100%-18px)];
}

.handle-mr {
  @apply right-0 top-4 h-[calc(100%-18px)];
}

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
