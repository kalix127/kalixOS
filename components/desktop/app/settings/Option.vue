<!-- Option.vue -->
<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  title?: string;
  label?: string;
  description?: string;
  isDisabled?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}>();

const { label, title, description, isDisabled } = toRefs(props);

const emit = defineEmits<{
  (e: "click"): void;
}>();

const handleClick = () => {
  if (isDisabled.value) return;
  emit("click");
};

const isOptionGroup = inject<boolean>("isOptionGroup", false);
</script>

<template>
  <div :class="!isOptionGroup ? 'space-y-2' : ''">
    <div
      v-if="!isOptionGroup && title"
      class="text-sm font-extrabold tracking-wide"
    >
      {{ title }}
    </div>

    <div
      @click="handleClick"
      :class="
        cn(
          'flex h-12 items-center justify-between bg-popover p-4 text-sm transition-colors hover:bg-secondary/80',
          isDisabled
            ? 'text-muted-foreground'
            : '',
          !isOptionGroup ? 'rounded-xl shadow-md' : '',
          isFirst ? 'rounded-t-xl' : '',
          isLast ? 'rounded-b-xl' : '',
          description ? 'h-[52px]' : '',
          props.class,
        )
      "
    >
      <div class="flex flex-col gap-1" v-if="label">
        <span>{{ label }}</span>
        <span v-if="description" class="text-xs text-muted-foreground">{{
          description
        }}</span>
      </div>
      <slot v-else name="label" />
      <slot name="action" />
    </div>
  </div>
</template>

<style></style>
