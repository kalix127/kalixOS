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
    ariaLabel: "seo.aria.minimize_window",
  },
  app.value.isFullscreen
    ? {
        icon: "gnome:collapse",
        emit: "fullscreen",
        ariaLabel: "seo.aria.restore_window",
      }
    : {
        icon: "gnome:expand",
        emit: "fullscreen",
        ariaLabel: "seo.aria.maximize_window",
      },
  {
    icon: "gnome:close",
    emit: "close",
    ariaLabel: "close",
  },
]);
</script>

<template>
  <div
    :class="[
      cn(
        'app-topbar grid h-10 grid-cols-3 bg-popover p-2 transition-all duration-300',
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
        v-for="action in actions"
        :key="action.icon"
        :aria-label="action.ariaLabel"
        variant="ghost"
        size="icon"
        class="size-6 rounded-full bg-secondary duration-300 hover:bg-secondary-hover"
      >
        <Icon :name="action.icon" size="18" @click="$emit(action.emit)" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
