<script setup lang="ts">
import type { FileSystemNode } from "~/types";

defineProps<{
  app: FileSystemNode;
}>();

</script>

<template>
  <DesktopDockAppTooltip :app-name="app.name">
    <Button
      variant="ghost"
      size="icon"
      class="grid cursor-default place-content-center rounded-2xl p-7 duration-0 hover:bg-accent/70"
    >
      <Icon :name="app.icon" size="40" />
    </Button>
  </DesktopDockAppTooltip>
</template>

<style scoped></style>
