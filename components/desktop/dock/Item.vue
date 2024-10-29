<script setup lang="ts">
const { hasAppsLoading } = storeToRefs(useDesktopStore());

defineProps<{
  appName: string;
  icon: string;
  isOpen: boolean;
}>();
</script>

<template>
  <DesktopDockItemTooltip :app-name="appName">
    <Button
      variant="ghost"
      size="icon"
      class="relative grid cursor-default place-content-center rounded-2xl p-7 duration-0 hover:bg-accent/70"
      :class="[hasAppsLoading ? 'cursor-progress' : '']"
    >
      <Icon :name="icon" size="40" />
      <div
        v-if="isOpen"
        class="absolute bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white"
      />
    </Button>
  </DesktopDockItemTooltip>
</template>

<style scoped></style>
