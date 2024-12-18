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
      <TooltipTrigger
        :aria-label="appName"
        as-child
        @click="$emit('click')"
      >
        <slot />
      </TooltipTrigger>
      <TooltipContent
        :side-offset="15"
        class="z-[50000] rounded-full bg-black/80"
      >
        <p>{{ isTranslated ? $t(appName) : appName }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped></style>
