<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { FileSystemNode } from "@/types";
import { cn } from "@/lib/utils";

defineProps<{
  class?: HTMLAttributes["class"];
  app: FileSystemNode;
}>();
</script>

<template>
  <div
    :class="
      cn(
        'grid h-full w-full place-content-center bg-background',
        $props.class,
      )
    "
  >
    CONTENT
    <p>X: {{ app.x }}</p>
    <p>Y: {{ app.y }}</p>
    <p>Width: {{ app.width }}</p>
    <p>Height: {{ app.height }}</p>
  </div>
</template>

<style scoped></style>
