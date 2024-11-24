<script setup lang="ts">
defineProps<{
  appName: string;
  isTranslated?: boolean;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <Tooltip :default-open="false">
      <TooltipTrigger @click="$emit('click')" as-child>
        <slot />
      </TooltipTrigger>
      <TooltipContent
        :sideOffset="15"
        class="z-[50000] rounded-full bg-black/80"
      >
        <p>{{ isTranslated ? $t(appName) : appName }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped></style>
