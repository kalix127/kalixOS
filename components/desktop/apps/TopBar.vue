<script setup lang="ts">
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "vue";

const isFullscreen = ref(false);

const actions = computed(() => [
  {
    icon: "material-symbols:minimize-rounded",
    emit: "minimize",
  },
  isFullscreen.value
    ? {
        icon: "material-symbols:fullscreen-exit-rounded",
        emit: "fullscreen",
      }
    : {
        icon: "material-symbols:expand-content-rounded",
        emit: "fullscreen",
      },
  {
    icon: "material-symbols:close-small-outline-rounded",
    emit: "close",
  },
]);

defineProps<{
  class?: HTMLAttributes["class"];
  title: string;
}>();

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();
</script>

<template>
  <div
    :class="
      cn('grid h-10 grid-cols-3 rounded-t-xl bg-popover p-2', $props.class)
    "
  >
    <!-- Empty div -->
    <div></div>

    <!-- Title -->
    <div
      class="text grid min-w-fit select-none place-content-center truncate text-center text-sm font-extrabold"
    >
      {{ title }}
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        class="cursor-default rounded-full bg-secondary duration-0 hover:bg-secondary-hover size-6"
        v-for="action in actions"
        :key="action.icon"
      >
        <Icon :name="action.icon" size="20" @click="$emit(action.emit)" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
