<script setup lang="ts">
const desktopStore = useDesktopStore();
const { dockApps, isDockVisible } = storeToRefs(desktopStore);

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
      <TooltipContent
        :side-offset="-6"
        class="h-fit w-full rounded-3xl px-3 py-2"
      >
        <div class="grid h-full grid-cols-4 items-center gap-4 sm:flex">
          <DesktopDockApp v-for="app in dockApps" :key="app.id" :app="app" />
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped></style>
