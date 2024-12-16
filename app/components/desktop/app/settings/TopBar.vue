<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
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

const { currentSettingsTab } = storeToRefs(useGlobalStore());
const isMobile = useBreakpoints(breakpointsTailwind).smaller("sm");
const isFullscreen = computed(() => inject<boolean>("isFullscreen")).value;

const actions = computed(() => [
  {
    icon: "gnome:minimize",
    emit: "minimize",
  },
  isFullscreen
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
    @dblclick="$emit('fullscreen')"
  >
    <!-- Empty div -->
    <div></div>

    <!-- Title -->
    <div
      class="text grid min-w-fit select-none place-content-center truncate text-center text-sm font-extrabold"
    >
      <template v-if="isMobile">
        {{ $t("settings") }}
      </template>
      <template v-else>
        {{ currentSettingsTab ? $t(currentSettingsTab) : "" }}
      </template>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        class="size-6 rounded-full bg-popover duration-300 hover:bg-secondary"
        v-for="action in actions"
        :key="action.icon"
      >
        <Icon
          :name="action.icon"
          size="18"
          @click.stop="() => $emit(action.emit)"
        />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
