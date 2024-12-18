<script setup lang="ts">
import { cn } from "@/lib/utils";
import { type HTMLAttributes, provide } from "vue";

defineProps<{
  class?: HTMLAttributes["class"];
  title?: string;
}>();

provide("isOptionGroup", true);
</script>

<template>
  <div :class="{ 'space-y-3': title }">
    <div
      v-if="title"
      class="flex items-center justify-start gap-2"
    >
      <span class="text-sm font-extrabold tracking-wide">{{ title }}</span>
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
