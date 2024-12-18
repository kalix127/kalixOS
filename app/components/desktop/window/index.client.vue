<script setup lang="ts">
import type { AppNode } from "@/types";
import { useThrottleFn } from "@vueuse/core";
import Vue3DraggableResizable from "vue3-draggable-resizable";

const props = defineProps<{ app: AppNode }>();
const { app } = toRefs(props);

const { minWidth, minHeight } = useWindowSizes();
const { initialWidth, initialHeight } = useWindowSizes();

const desktopStore = useDesktopStore();
const { closeApp, toggleMinimizeApp } = desktopStore;

const isDraggable = ref(false);
const setDraggable = useThrottleFn((value: boolean) => {
  isDraggable.value = value;
}, 10);

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
provide("isFullscreen", isFullscreen);
provide("isActive", isActive);
provide("setDraggable", setDraggable);
provide("app", app);
</script>

<template>
  <Vue3DraggableResizable
    v-model:w="localWidth"
    v-model:h="localHeight"
    v-model:x="localX"
    v-model:y="localY"
    v-model:active="isActive"
    :parent="true"
    :init-w="initialWidth"
    :init-h="initialHeight"
    :min-w="minWidth"
    :min-h="minHeight"
    :resizable="!isFullscreen"
    :draggable="!isFullscreen && isDraggable"
    :style="{ zIndex: isActive ? 10000 : 5000 }"
    class-name-handle="handle"
    class-name-dragging="app-dragging"
    class-name-resizing="app-resizing"
    class="absolute !border-none duration-300"
    :class="[
      !isFullscreen ? 'rounded-t-xl' : '',
      isActive
        ? 'shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]'
        : 'shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)]',
    ]"
    @activated="() => handleActive(true)"
    @deactivated="() => handleActive(false)"
    @click="() => handleActive(true)"
  >
    <div
      :id="app.id"
      class="relative h-full w-full"
    >
      <component
        :is="getAppComponent(app.id)"
        @minimize="() => toggleMinimizeApp(app.id)"
        @fullscreen="() => handleFullscreen(!isFullscreen)"
        @close="() => closeApp(app.id)"
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
