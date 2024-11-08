<script setup lang="ts">
import type { AppNode } from "@/types";
import VueDraggableResizable from "vue-draggable-resizable";

const desktopStore = useDesktopStore();
const { desktopRef } = storeToRefs(desktopStore);
storeToRefs(desktopStore);
const { closeApp, toggleMinimizeApp } = desktopStore;

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const appRef = ref<InstanceType<typeof VueDraggableResizable>>();

const { minAppSizes } = useAppSizes();

const {
  handleActive,
  handleDragStop,
  handleDragging,
  handleResizeStop,
  handleFullscreen,
} = useAppHandlers(app, appRef);
</script>

<template>
  <vue-draggable-resizable
    ref="appRef"
    :min-width="minAppSizes.minWidth"
    :min-height="minAppSizes.minHeight"
    :w="app.width"
    :h="app.height"
    :x="app.x"
    :y="app.y"
    :active="app.isActive"
    :resizable="app.isFullscreen ? false : true"
    :draggable="app.isFullscreen ? false : true"
    :parent="true"
    @dragging="handleDragging"
    @dragStop="handleDragStop"
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
    class="absolute left-0 top-0 rounded-t-xl !border-none duration-300"
  >
    <div class="relative grid h-full w-full grid-rows-[40px_1fr]">
      <!-- Top bar -->
      <DesktopAppTopBar
        @minimize="() => toggleMinimizeApp(app.id)"
        @fullscreen="handleFullscreen()"
        @close="() => closeApp(app.id)"
        :title="app.name"
        :isFullscreen="app.isFullscreen"
        :isActive="app.isActive"
        class="app-topbar"
      />

      <!-- Content -->
      <DesktopAppSettings v-if="app.id === 'settings'" :app="app" />
      <DesktopAppTrash v-if="app.id === 'trash'" :app="app" />
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
