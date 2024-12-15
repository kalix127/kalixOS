<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core";

const { memoryUsedPercentage } = storeToRefs(useGlobalStore());

const cpuUsage = ref("0.00%");
const memoryUsage = ref("0.00%");

// Function to generate random CPU and memory usage with decimals
const getRandomValue = (
  min: number,
  max: number,
): { value: string; percentage: number } => {
  const value = (Math.random() * (max - min) + min).toFixed(2);
  return { value: `${value}%`, percentage: Math.round(Number(value)) };
};

useIntervalFn(
  () => {
    const randomCpuUsage = getRandomValue(5, 80); // CPU between 5 and 80%
    const randomMemoryUsage = getRandomValue(15, 95); // Memory between 15 and 95%
    cpuUsage.value = randomCpuUsage.value;
    memoryUsage.value = `${randomMemoryUsage.value}`;
    memoryUsedPercentage.value = randomMemoryUsage.percentage;
  },
  1000,
  { immediate: true },
);
</script>

<template>
  <div
    class="hidden select-none items-center gap-4 text-nowrap rounded-full px-3 py-1 text-sm font-extrabold transition-colors duration-100 ease-in-out hover:bg-secondary/50 lg:flex"
  >
    <span>CPU: {{ cpuUsage }}</span>
    <span>Mem: {{ memoryUsage }}</span>
  </div>
</template>

<style scoped></style>
