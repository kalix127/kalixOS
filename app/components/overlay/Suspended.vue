<script lang="ts" setup>
const { suspendedPercentage } = storeToRefs(useGlobalStore());
const opacity = computed(
  () => `${Math.round(suspendedPercentage.value * 100)}%`,
);
</script>

<template>
  <div
    class="absolute left-0 top-0 z-[100000] h-svh w-svw bg-black transition-opacity duration-500"
    :style="{ opacity }"
  />
</template>
