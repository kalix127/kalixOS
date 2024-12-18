<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  title?: string;
  label?: string;
  description?: string;
  isDisabled?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  isCenter?: boolean;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const { label, title, description, isDisabled } = toRefs(props);

function handleClick() {
  if (isDisabled.value)
    return;
  emit("click");
}

const isOptionGroup = inject<boolean>("isOptionGroup", false);
</script>

<template>
  <div :class="{ 'space-y-3': !isOptionGroup }">
    <div
      v-if="!isOptionGroup && title"
      class="text-sm font-bold tracking-wide"
    >
      {{ title }}
    </div>

    <slot name="title" />

    <div
      :class="
        cn(
          'flex min-h-12 items-center bg-popover p-3 text-sm transition-colors hover:bg-secondary/80',
          isCenter ? 'h-fit justify-center' : 'justify-between',
          isDisabled ? 'text-muted-foreground' : '',
          !isOptionGroup ? 'rounded-xl shadow-md' : '',
          isFirst ? 'rounded-t-xl' : '',
          isLast ? 'rounded-b-xl' : '',
          $props.class,
        )
      "
      @click="handleClick"
    >
      <div
        v-if="label"
        class="flex flex-col gap-1"
      >
        <span>{{ label }}</span>
        <span
          v-if="description"
          class="text-xs text-muted-foreground"
        >{{
          description
        }}</span>
      </div>
      <slot
        v-else
        name="label"
      />
      <slot name="center" />
      <slot name="action" />
    </div>
  </div>
</template>

<style></style>
