<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { AppNode } from "@/types";
import {
  watchThrottled,
  breakpointsTailwind,
  useBreakpoints,
} from "@vueuse/core";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  app: AppNode;
}>();

const { app } = toRefs(props);

const terminalElement = ref<HTMLElement | null>(null);
const isMobileOrTablet = useBreakpoints(breakpointsTailwind).smaller("lg");

onMounted(() => {
  if (!terminalElement.value) return;
  const { term } = useTerminal(terminalElement.value);

  // Necessary to make it responsive
  watchThrottled(
    app,
    () => {
      // 40px is the height of the app's topbar
      // 17px is the height of a terminal row
      const rows = Math.floor((app.value.height - 40) / 17);
      const cols = Math.floor(app.value.width / 8) + 3;
      term.resize(cols, rows);
    },
    { throttle: 20, deep: true, immediate: true },
  );
});
</script>

<template>
  <div v-if="!isMobileOrTablet" ref="terminalElement" class="bg-black"></div>
  <div v-else class="grid h-full w-full place-content-center bg-background p-8">
    <div class="flex flex-col items-center gap-6">
      <Icon name="gnome:warning" size="140" class="text-muted-foreground" />
      <p class="text-center">
        {{ $t("terminal_not_available_on_mobile") }}
      </p>
    </div>
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
