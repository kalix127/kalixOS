<script setup lang="ts">
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "vue";

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

defineProps<{
  class?: HTMLAttributes["class"];
}>();

const isFullscreen = computed(() => inject("isFullscreen") as boolean).value;
const isActive = computed(() => inject("isActive") as boolean).value;
const appName = computed(() => inject("appName") as string).value;
const appTitle = computed(() => inject("appTitle") as string).value;
const setDraggable = inject("setDraggable") as (value: boolean) => void;

const actions = computed(() => [
  {
    icon: "gnome:minimize",
    emit: "minimize",
    ariaLabel: "seo.aria.minimize_window",
  },
  isFullscreen
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
    <div></div>

    <!-- Title -->
    <div
      class="text grid min-w-fit select-none place-content-center truncate text-center text-sm font-extrabold"
    >
      {{ appTitle ? `${appName} - ${appTitle}` : appName }}
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
      >
        <Icon :name="action.icon" size="18" @click="$emit(action.emit)" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
