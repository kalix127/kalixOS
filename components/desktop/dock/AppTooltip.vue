<script setup lang="ts">
defineProps<{
  appName: string;
}>();
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <Tooltip :default-open="false">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipContent :sideOffset="15" class="rounded-full bg-black/80">
        <p>{{ appName }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped></style>
