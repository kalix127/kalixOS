<script setup lang="ts">
const { setSettingsTab } = useGlobalStore();
</script>

<template>
  <ScrollArea class="relative h-full w-full px-6 py-8 sm:px-12">
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
