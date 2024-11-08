<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { AppNode } from "@/types";
import { cn } from "@/lib/utils";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  app: AppNode;
}>();

const { app } = toRefs(props);

const { currentSettingsTab } = storeToRefs(useGlobalStore());

const isMobile = useBreakpoints(breakpointsTailwind).smaller("sm");

const scrollAreaHeight = computed(() => {
  const topBarHeight = 40;
  const windowContentHeight = app.value.height - topBarHeight;
  return windowContentHeight;
});
</script>

<template>
  <div
    :class="
      cn(
        `grid bg-background ${
          isMobile ? 'grid-cols-[1fr]' : 'grid-cols-[25%_75%]'
        }`,
        $props.class,
      )
    "
  >
    <!-- Sidebar -->
    <DesktopAppSettingsSidebar
      v-if="!isMobile || !currentSettingsTab"
      :is-active="app.isActive"
      :style="{
        height: `${scrollAreaHeight}px`,
      }"
    />

    <!-- Content -->
    <div
      v-if="!isMobile || currentSettingsTab"
      class="flex flex-col items-center justify-start"
      :style="{
        height: `${scrollAreaHeight}px`,
      }"
    > 
      <Transition mode="out-in">
        <DesktopAppSettingsTabWifi v-if="currentSettingsTab === 'wifi'" />
        <div v-else></div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
