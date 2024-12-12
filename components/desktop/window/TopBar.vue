<script setup lang="ts">
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "vue";
import type { AppNode } from "@/types";

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

const props = defineProps<{
  class?: HTMLAttributes["class"];
  app: AppNode;
}>();

const { app } = toRefs(props);

const actions = computed(() => [
  {
    icon: "gnome:minimize",
    emit: "minimize",
  },
  app.value.isFullscreen
    ? {
        icon: "gnome:collapse",
        emit: "fullscreen",
      }
    : {
        icon: "gnome:expand",
        emit: "fullscreen",
      },
  {
    icon: "gnome:close",
    emit: "close",
  },
]);
</script>

<template>
  <div
    :class="[
      cn(
        'grid h-10 grid-cols-3 p-2 transition-all duration-300 app-topbar bg-popover',
        !app.isFullscreen ? 'rounded-t-xl' : '',
        !app.isActive ? 'brightness-[0.75]' : '',
        $props.class,
      ),
    ]"
    @dblclick="$emit('fullscreen')"
  >
    <!-- Empty div -->
    <div></div>

    <!-- Title -->
    <div
      class="text grid min-w-fit select-none place-content-center truncate text-center text-sm font-extrabold"
    >
      {{ app.title ? `${app.name} - ${app.title}` : app.name }}
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        class="size-6 bg-secondary rounded-full duration-300 hover:bg-secondary-hover"
        v-for="action in actions"
        :key="action.icon"
      >
        <Icon :name="action.icon" size="18" @click="$emit(action.emit)" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
