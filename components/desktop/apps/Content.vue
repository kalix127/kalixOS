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
      cn('grid h-full w-full shadow-lg place-content-center bg-background', $props.class)
    "
  >
    CONTENT
  </div>
</template>

<style scoped></style>
