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
  <div :class="[title ? 'space-y-2' : '']">
    <div class="flex items-center justify-start gap-2" v-if="title">
      <span class="text-sm font-extrabold tracking-wide">{{ $t(title) }}</span>
      <slot name="title-loading-icon" />
    </div>

    <div
      :class="
        cn(
          'option-group group flex flex-col justify-between gap-px shadow-lg',
          $props.class,
        )
      "
    >
      <slot />
    </div>
  </div>
</template>

<style></style>
