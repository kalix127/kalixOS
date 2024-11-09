<script setup lang="ts">
import type { AppNode } from "@/types";

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

onMounted(() => {
  app.value.isModalOpen = true;
});

onUnmounted(() => {
  app.value.isModalOpen = false;
});
</script>

<template>
  <Teleport :to="`#${app.id}`">
    <slot />
  </Teleport>
</template>

<style scoped></style>
