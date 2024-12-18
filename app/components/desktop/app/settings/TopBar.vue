<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

defineProps<{
  class?: HTMLAttributes["class"];
}>();

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

const { currentSettingsTab } = storeToRefs(useGlobalStore());
const isFullscreen = inject("isFullscreen") as Ref<boolean>;

const actions = computed(() => [
  {
    icon: "gnome:minimize",
    emit: "minimize",
  },
  isFullscreen.value
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
    :class="
      cn(
        'grid h-10 grid-cols-3 p-2 transition-colors duration-300',
        $props.class,
      )
    "
    @dblclick="() => $emit('fullscreen')"
  >
    <!-- Empty div -->
    <div />

    <!-- Title -->
    <div
      class="text grid min-w-fit select-none place-content-center truncate text-center text-sm font-extrabold"
    >
      <span>
        {{ currentSettingsTab ? $t(currentSettingsTab) : "" }}
      </span>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2">
      <Button
        v-for="action in actions"
        :key="action.icon"
        variant="ghost"
        size="icon"
        class="size-6 rounded-full bg-popover duration-300 hover:bg-secondary"
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
