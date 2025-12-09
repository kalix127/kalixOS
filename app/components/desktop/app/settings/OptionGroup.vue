<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { provide } from "vue";
import { cn } from "@/lib/utils";

defineProps<{
  class?: HTMLAttributes["class"];
  title?: string;
}>();

provide("isOptionGroup", true);
</script>

<template>
  <div :class="{ 'space-y-3': title }">
    <div v-if="title" class="flex items-center justify-start gap-2">
      <span class="text-sm font-bold tracking-wide">{{ title }}</span>
      <slot name="title-loading-icon" />
    </div>

    <div
      :class="
        cn(
          'option-group group flex flex-col justify-between gap-px shadow-md',
          $props.class,
        )
      "
    >
      <slot />
    </div>
  </div>
</template>

<style></style>
