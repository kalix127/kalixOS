<script setup lang="ts">
import VueDraggableResizable from "vue-draggable-resizable";
import type { AppNode } from "@/types";

const desktopStore = useDesktopStore();
const { activeApp } = storeToRefs(desktopStore);
const { closeApp, minimizeApp, enterFullscreen } = desktopStore;

const { app } = defineProps<{
  app: AppNode;
}>();

function handleFocusApp() {
  activeApp.value = app;
}

// TODO: Implement this
function handleResizeEnd() {
  // Update width and height
}

// TODO: Implement this
function handleDragEnd() {
  // Check if the topbar is out of the viewport
  // Update x,y values
}
</script>

<template>
  <vue-draggable-resizable
    :w="700"
    :h="400"
    :resizable="true"
    :draggable="true"
    :drag-handle="'.app-topbar'"
    @activated="handleFocusApp"
    @on-resize-end="handleResizeEnd"
    @on-drag-end="handleDragEnd"
    :style="{
      zIndex: activeApp?.id === app.id ? 20000 : 'auto',
    }"
    @click="handleFocusApp"
    class="absolute left-1/2 top-1/2"
  >
    <!-- Top bar -->
    <DesktopAppsTopBar
      @minimize="() => minimizeApp(app.id)"
      @fullscreen="() => enterFullscreen(app.id)"
      @close="() => closeApp(app.id)"
      :title="app.name"
      class="app-topbar"
    />

    <!-- Content -->
    <DesktopAppsContent :app="app" />
  </vue-draggable-resizable>
</template>

<style scoped></style>
