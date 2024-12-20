<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { watchThrottled } from "@vueuse/core";

defineProps<{
  class?: HTMLAttributes["class"];
}>();

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

const localWidth = inject("localWidth") as Ref<number>;
const localHeight = inject("localHeight") as Ref<number>;

const terminalElement = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!terminalElement.value || !localWidth.value || !localHeight.value)
    return;
  const { term } = useTerminal(terminalElement.value);

  // Necessary to make it responsive
  watchThrottled(
    [localHeight, localWidth],
    ([newHeight, newWidth]: [number, number]) => {
      // 40px is the height of the app's topbar
      // 17px is the height of a terminal row
      const rows = Math.floor((newHeight - 40) / 17);
      const cols = Math.floor(newWidth / 8) + 3;
      term.resize(cols, rows);
    },
    { throttle: 10, deep: true, immediate: true },
  );
});
</script>

<template>
  <div class="grid size-full grid-rows-[40px_1fr]">
    <!-- Top bar -->
    <DesktopWindowTopBar
      @minimize="() => $emit('minimize')"
      @fullscreen="() => $emit('fullscreen')"
      @close="() => $emit('close')"
    />

    <!-- Terminal -->
    <div
      ref="terminalElement"
      class="bg-[#161420]"
    />
  </div>
</template>

<style>
@import "@xterm/xterm/css/xterm.css";

/* Remove the default terminal scrollbar */
.xterm .xterm-viewport {
  scrollbar-width: 0px;
}
.xterm-viewport::-webkit-scrollbar {
  width: 0px;
}

.xterm .xterm-viewport {
  /* see : https://github.com/xtermjs/xterm.js/issues/3564#issuecomment-1004417440 */
  width: initial !important;
}
</style>
