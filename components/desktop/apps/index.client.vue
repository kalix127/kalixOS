<script setup lang="ts">
import type { AppNode } from "@/types";
import VueDraggableResizable from "vue-draggable-resizable";

const desktopStore = useDesktopStore();
const { activeApp } = storeToRefs(desktopStore);
storeToRefs(desktopStore);
const { closeApp, minimizeApp } = desktopStore;

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const appRef = ref<InstanceType<typeof VueDraggableResizable>>();

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
    :x="app.x"
    :y="app.y"
    :w="app.width"
    :h="app.height"
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
    :style="{
      zIndex: app.isActive ? 10000 : 5000,
    }"
    class="absolute left-0 top-0 rounded-t-xl !border-none"
  >
    <div class="relative grid h-full w-full grid-rows-[40px_1fr]">
      <!-- Top bar -->
      <DesktopAppsTopBar
        @minimize="() => minimizeApp(app.id)"
        @fullscreen="handleFullscreen()"
        @close="() => closeApp(app.id)"
        :title="app.name"
        :isFullscreen="app.isFullscreen"
        :isActive="app.isActive"
        class="app-topbar"
      />

      <!-- Content -->
      <DesktopAppsContent :app="app" />
    </div>
  </vue-draggable-resizable>
</template>

<style>
@import "vue-draggable-resizable/style.css";

.handle {
  @apply z-10 !block h-2 w-2 border-none bg-transparent;
}

/* Top */
.handle-tl {
  @apply left-0 top-0;
}

.handle-tm {
  @apply -top-1 left-4 w-[calc(100%-22px)];
}

.handle-tr {
  @apply right-0 top-0;
}

/* Middle */

.handle-ml {
  @apply -left-1 top-4 h-[calc(100%-18px)];
}

.handle-mr {
  @apply -right-1 top-4 h-[calc(100%-18px)];
}

/* Bottom */
.handle-bl {
  @apply -bottom-1 -left-1;
}

.handle-bm {
  @apply -bottom-1 left-3 h-2 w-[calc(100%-13px)];
}

.handle-br {
  @apply -bottom-1 -right-1;
}
</style>
