<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    :class="
      cn(
        'option-group group flex flex-col justify-between gap-px',
        $props.class,
      )
    "
  >
    <slot />
  </div>
</template>

<style>
.option-group .option:first-child {
  @apply rounded-t-xl;
}

.option-group .option:last-child {
  @apply rounded-b-xl;
}
</style>
