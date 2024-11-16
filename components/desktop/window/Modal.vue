<script setup lang="ts">
import type { AppNode } from "@/types";

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const modalSizes = computed(() => {
  return {
    minWidth: Math.floor(app.value.width * 0.8),
    maxWidth: Math.floor(app.value.height * 0.9),
  };
});

onMounted(() => {
  app.value.isModalOpen = true;
});

onUnmounted(() => {
  app.value.isModalOpen = false;
});
</script>

<template>
  <Teleport :to="`#${app.id}`">
    <div
      class="absolute left-1/2 top-1/2 max-h-[100svh] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background shadow-lg transition-all duration-300"
      :class="[app.isActive ? '' : 'brightness-[0.8]']"
      :style="{
        minWidth: `${modalSizes.minWidth}px`,
        maxWidth: `${modalSizes.maxWidth}px`,
      }"
    >
      <slot />
    </div>
  </Teleport>
</template>

<style scoped></style>
