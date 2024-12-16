<script setup lang="ts">
import type { AppNode } from "@/types";
import Vue3DraggableResizable from "vue3-draggable-resizable";

const props = defineProps<{ app: AppNode }>();
const { app } = toRefs(props);

const { minWidth, minHeight } = useWindowSizes();
const { initialWidth, initialHeight } = useWindowSizes();

const desktopStore = useDesktopStore();
const { closeApp, toggleMinimizeApp } = desktopStore;

const isDragDisabled = ref(false);

const {
  localWidth,
  localHeight,
  localX,
  localY,
  isFullscreen,
  isActive,
  getAppComponent,
  handleFullscreen,
  handleActive,
} = useWindow(app);

provide("localWidth", localWidth);
provide("localHeight", localHeight);
provide("localX", localX);
provide("localY", localY);
provide("isFullscreen", isFullscreen);
provide("isActive", isActive);
provide("isMinimized", app.value.isMinimized);
provide("appName", app.value.name);
provide("appTitle", app.value.title);
</script>

<template>
  <Vue3DraggableResizable
    :parent="true"
    :init-w="initialWidth"
    :init-h="initialHeight"
    :min-w="minWidth"
    :min-h="minHeight"
    v-model:w="localWidth"
    v-model:h="localHeight"
    v-model:x="localX"
    v-model:y="localY"
    v-model:active="isActive"
    @activated="() => handleActive(true)"
    @deactivated="() => handleActive(false)"
    @click="() => handleActive(true)"
    :resizable="!isFullscreen"
    :draggable="!isFullscreen && isDragDisabled"
    :style="{ zIndex: isActive ? 10000 : 5000 }"
    classNameHandle="handle"
    classNameDragging="app-dragging"
    classNameResizing="app-resizing"
    class="absolute !border-none duration-300"
    :class="[
      !isFullscreen ? 'rounded-t-xl' : '',
      isActive
        ? 'shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]'
        : 'shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)]',
    ]"
  >
    <div :id="app.id" class="relative h-full w-full">
      <component
        :is="getAppComponent(app.id)"
        @minimize="() => toggleMinimizeApp(app.id)"
        @fullscreen="() => handleFullscreen(!isFullscreen)"
        @close="() => closeApp(app.id)"
        @toggleDrag="(value) => (isDragDisabled = value)"
      />
    </div>
  </Vue3DraggableResizable>
</template>

<style>
@import "@/assets/css/vue-draggable-resizable.css";

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
  @apply left-0.5 top-0.5;
}

.handle-tm {
  @apply left-4 top-0 w-[calc(100%-22px)];
}

.handle-tr {
  @apply right-0.5 top-0.5;
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
