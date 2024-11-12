<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  label?: string;
  isDisabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const handleClick = () => {
  if (props.isDisabled) return;
  emit("click");
};
</script>

<template>
  <div
    @click="handleClick"
    :class="
      cn(
        'option flex h-12 items-center justify-between bg-popover p-4 text-sm transition-colors hover:bg-secondary/80',
        isDisabled ? 'text-muted-foreground' : '',
        $props.class,
      )
    "
  >
    <span v-if="label">{{ label }}</span>
    <slot v-else name="label" />
    <slot name="action" />
  </div>
</template>

<style>
.option:not(.option-group .option) {
  @apply rounded-xl shadow-lg;
}
</style>
