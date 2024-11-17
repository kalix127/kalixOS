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
    src="https://www.google.com/webhp?igu=1"
    :class="cn('h-full w-full bg-background', $props.class)"
    sandbox="allow-scripts allow-same-origin allow-forms"
    referrerpolicy="no-referrer"
    loading="lazy"
    width="100%"
    height="100%"
    allow="clipboard-read; clipboard-write;"
    title="Brave"
  ></iframe>
  <div v-else class="grid h-full w-full place-content-center bg-background p-8">
    <div class="flex flex-col items-center gap-6">
      <Icon name="gnome:warning" size="140" class="text-muted-foreground" />
      <p class="text-center">
        {{ $t("brave_not_available_on_mobile") }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
