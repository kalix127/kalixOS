<script setup lang="ts">
import type { AppNode } from "@/types";
import { useWindowSize } from "@vueuse/core";
import VueDraggableResizable from "vue-draggable-resizable";

const desktopStore = useDesktopStore();
const { activeApp, desktopRef } = storeToRefs(desktopStore);
storeToRefs(desktopStore);
const { closeApp, minimizeApp, enterFullscreen, exitFullscreen, updateApp } =
  desktopStore;

const { isMobileOrTablet } = useDevice();
const { width: windowWidth, height: windowHeight } = useWindowSize();

const props = defineProps<{
  app: AppNode;
}>();

const app = computed(() => props.app);
const appRef = ref<InstanceType<typeof VueDraggableResizable>>();

const initialAppSizes = computed(() => {
  if (isMobileOrTablet) {
    // Mobile
    const width = Math.min(300, windowWidth.value * 0.9);
    const height = (width * 16) / 9;
    return { width: Math.round(width), height: Math.round(height) };
  }

  // Desktop
  const width = windowWidth.value * 0.7;
  const height = (width * 9) / 16;

  return { width: Math.round(width), height: Math.round(height) };
});

const initialAppPositions = computed(() => {
  const { width, height } = initialAppSizes.value;
  const desktopWidth = desktopRef.value?.offsetWidth || windowWidth.value;
  const desktopHeight = desktopRef.value?.offsetHeight || windowHeight.value;

  const x = Math.max(0, Math.floor((desktopWidth - width) / 2));
  const y = Math.max(0, Math.floor((desktopHeight - height) / 2));

  return { x: Math.round(x), y: Math.round(y) };
});

function handleActivated() {
  activeApp.value = app.value;
}

function handleDeactivated() {
  activeApp.value = null;
}

function handleResizeStop(x: number, y: number, width: number, height: number) {
  const updatedData = {
    width: Math.round(width),
    height: Math.round(height),
  };
  updateApp(app.value.id, updatedData);
}

function handleDragging(x: number, y: number) {
  // Update the app's position only if the user is dragging the app to the top bar, to prevent spam and update the hasAppsAtTop state

  // Those updates triggers hasAppsAtTop computed property to update topbar background
  if (y < 2) {
    handleDragStop(x, y);
  } else if (y > 2 && y < 20) {
    handleDragStop(x, y);
  }

}

function handleDragStop(x: number, y: number) {
  // Prevent the app from being dragged outside the desktop bounds
  // Set 1 to avoid animation bug when the value is 0
  if (x <= 0) {
    x = 1;
  }
  if (y <= 0) {
    y = 1;
  }

  const updatedData = {
    x: Math.round(x),
    y: Math.round(y),
  };
  updateApp(app.value.id, updatedData);
}

function handleFullscreen() {
  // If the app is already fullscreen, exit fullscreen
  if (app.value.isFullscreen) {
    exitFullscreen(
      app.value.id,
      initialAppSizes.value.width,
      initialAppSizes.value.height,
      initialAppPositions.value.x,
      initialAppPositions.value.y,
    );
    return;
  }

  // Else, enter fullscreen
  enterFullscreen(app.value.id);
}

onMounted(() => {
  // Update the app's size and position if it's the first open
  if (!app.value.width || !app.value.height || !app.value.x || !app.value.y) {
    const updatedData = {
      ...initialAppSizes.value,
      ...initialAppPositions.value,
    };
    updateApp(app.value.id, updatedData);
  }
});

onBeforeUpdate(() => {
  if (appRef.value) {
    appRef.value.width = app.value.width;
    appRef.value.height = app.value.height;
  }
});
</script>

<template>
  <vue-draggable-resizable
    ref="appRef"
    :x="app.x || initialAppPositions.x"
    :y="app.y || initialAppPositions.y"
    :w="app.width || initialAppSizes.width"
    :h="app.height || initialAppSizes.height"
    :resizable="true"
    :draggable="true"
    :parent="true"
    @dragging="handleDragging"
    @dragStop="handleDragStop"
    @resizeStop="handleResizeStop"
    @click="handleActivated"
    @activated="handleActivated"
    @deactivated="handleDeactivated"
    dragHandle=".app-topbar"
    className="resize-handle"
    :style="{
      zIndex: activeApp?.id === app.id ? 20000 : 'auto',
    }"
    class="absolute left-0 top-0 rounded-t-xl"
  >
    <!-- Resize handles -->
    <div class="relative grid h-full w-full grid-rows-[40px_1fr]">
      <!-- Top bar -->
      <DesktopAppsTopBar
        @minimize="() => minimizeApp(app.id)"
        @fullscreen="handleFullscreen()"
        @close="() => closeApp(app.id)"
        :title="app.name"
        class="app-topbar"
      />

      <!-- Content -->
      <DesktopAppsContent :app="app" />
    </div>
    <div class="absolute bottom-0 left-0"></div>
  </vue-draggable-resizable>
</template>

<style>
@import "vue-draggable-resizable/style.css";
</style>
