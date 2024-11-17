<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { AppNode } from "@/types";
import { cn } from "@/lib/utils";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  app: AppNode;
}>();

const { app } = toRefs(props);

const isMobile = useBreakpoints(breakpointsTailwind).isSmaller("md");
</script>

<template>
  <iframe
    v-if="!isMobile"
    src="https://github1s.com/GianlucaIavicoli/GianlucaIavicoli"
    :class="cn('h-full w-full bg-background', $props.class)"
    sandbox="allow-scripts allow-same-origin allow-forms"
    referrerpolicy="no-referrer"
    width="100%"
    height="100%"
    loading="lazy"
    title="VS Code"
  ></iframe>
  <div v-else class="grid h-full w-full place-content-center bg-background p-8">
    <div class="flex flex-col items-center gap-6">
      <Icon name="gnome:warning" size="140" class="text-muted-foreground" />
      <p class="text-center">
        {{ $t("vscode_not_available_on_mobile") }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
