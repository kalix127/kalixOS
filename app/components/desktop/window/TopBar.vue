<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { AppNode } from "@/types";
import { cn } from "@/lib/utils";

defineProps<{
  class?: HTMLAttributes["class"];
}>();

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

const isFullscreen = inject("isFullscreen") as Ref<boolean>;
const isActive = inject("isActive") as Ref<boolean>;
const setDraggable = inject("setDraggable") as (value: boolean) => void;

const app = inject("app") as AppNode;

const actions = computed(() => [
  {
    icon: "gnome:minimize",
    emit: "minimize",
    ariaLabel: "seo.aria.minimize_window",
  },
  isFullscreen.value
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
        !isFullscreen ? 'rounded-t-xl' : '',
        !isActive ? 'brightness-[0.85]' : '',
        $props.class,
      ),
    ]"
    @dblclick="() => $emit('fullscreen')"
    @mouseenter.stop="() => setDraggable(true)"
    @mouseleave.stop="() => setDraggable(false)"
  >
    <!-- Empty div -->
    <div />

    <!-- Title -->
    <div
      class="text grid min-w-fit select-none place-content-center truncate text-center text-sm font-bold"
    >
      {{ app.title ? `${app.name} - ${app.title}` : app.name }}
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2">
      <Button
        v-for="action in actions"
        :key="action.icon"
        :aria-label="$t(action.ariaLabel)"
        variant="ghost"
        size="icon"
        class="size-6 rounded-full bg-secondary duration-300 hover:bg-secondary-hover"
        @click.stop="() => $emit(action.emit)"
        @dblclick.stop=""
      >
        <Icon
          :name="action.icon"
          size="18"
        />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
