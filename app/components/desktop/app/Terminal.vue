<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { AppNode } from "@/types";
import { watchDebounced } from "@vueuse/core";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  app: AppNode;
}>();

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

const { app } = toRefs(props);

const terminalElement = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!terminalElement.value) return;
  const { term } = useTerminal(terminalElement.value);

  // Necessary to make it responsive
  watchDebounced(
    app,
    () => {
      // 40px is the height of the app's topbar
      // 17px is the height of a terminal row
      const rows = Math.floor((app.value.height - 40) / 17);
      const cols = Math.floor(app.value.width / 8) + 3;
      term.resize(cols, rows);
    },
    { debounce: 100, deep: true, immediate: true },
  );
});
</script>

<template>
  <div class="grid h-full w-full grid-rows-[40px_1fr]">
    <!-- Top bar -->
    <DesktopWindowTopBar
      @minimize="$emit('minimize')"
      @fullscreen="$emit('fullscreen')"
      @close="$emit('close')"
      :app="app"
    />

    <!-- Terminal -->
    <div ref="terminalElement" class="bg-[#161420]"></div>
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
