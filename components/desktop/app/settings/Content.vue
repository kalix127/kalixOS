<script setup lang="ts">
import type { AppNode } from "@/types";

const { setSettingsTab } = useGlobalStore();

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);
</script>

<template>
  <ScrollArea
    class="relative h-full w-full px-6 py-8 transition-all duration-300 sm:px-12"
    :class="{
      'pointer-events-none brightness-[0.8]': app.isModalOpen,
    }"
  >
    <Button
      variant="ghost"
      size="icon"
      class="absolute left-1.5 top-1.5 grid size-6 place-content-center sm:hidden"
      @click="() => setSettingsTab(null)"
    >
      <Icon name="gnome:arrow-long-left" size="16" />
    </Button>
    <slot />
  </ScrollArea>
</template>

<style scoped></style>
