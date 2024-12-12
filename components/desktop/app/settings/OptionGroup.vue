<script setup lang="ts">
import { provide, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

defineProps<{
  class?: HTMLAttributes["class"];
  title?: string;
}>();

provide("isOptionGroup", true);
</script>

<template>
  <div :class="{ 'space-y-3': title }">
    <div class="flex items-center justify-start gap-2" v-if="title">
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
