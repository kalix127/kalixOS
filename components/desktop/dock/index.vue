<script setup lang="ts">
const desktopStore = useDesktopStore();
const { isDockVisible } = storeToRefs(desktopStore);

const handleTooltip = (open: boolean) => {
  isDockVisible.value = open;
};
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <Tooltip @update:open="handleTooltip">
      <TooltipTrigger
        class="absolute bottom-0 left-0 z-50 h-4 w-full cursor-default"
        @mouseenter="handleTooltip(true)"
        @mouseleave="handleTooltip(false)"
      >
      </TooltipTrigger>
      <TooltipContent :side-offset="-6" class="rounded-3xl p-0">
        <DesktopDockContent />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped></style>
