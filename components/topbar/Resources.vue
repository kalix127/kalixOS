<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core";

const { hasAppsAtTop } = storeToRefs(useDesktopStore());

const cpuUsage = ref("0.00%");
const memoryUsage = ref("0.00%");

// Function to generate random CPU and memory usage with decimals
const getRandomValue = (min: number, max: number): string => {
  const value = (Math.random() * (max - min) + min).toFixed(2);
  return `${value}%`;
};

useIntervalFn(
  () => {
    cpuUsage.value = getRandomValue(5, 80); // CPU between 5 and 80%
    memoryUsage.value = getRandomValue(15, 95); // Memory between 15 and 95%
  },
  1000,
  { immediate: true },
);
</script>

<template>
  <div
    class="hidden cursor-default select-none items-center gap-4 text-nowrap rounded-full px-3 py-1 text-sm font-extrabold transition-colors duration-100 ease-in-out hover:bg-secondary lg:flex"
    :class="!hasAppsAtTop ? 'hover:bg-secondary/50' : ''"
  >
    <span>CPU: {{ cpuUsage }}</span>
    <span>Mem: {{ memoryUsage }}</span>
  </div>
</template>

<style scoped></style>
