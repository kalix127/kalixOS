<script setup lang="ts">
const cpuUsage = ref("0.00%");
const memoryUsage = ref("0.00%");

// Function to generate random CPU and memory usage with decimals
const getRandomValue = (min: number, max: number): string => {
  const value = (Math.random() * (max - min) + min).toFixed(2);
  return `${value}%`;
};

onMounted(() => {
  const interval = setInterval(() => {
    cpuUsage.value = getRandomValue(5, 80); // CPU between 5 and 80%
    memoryUsage.value = getRandomValue(15, 95); // Memory between 15 and 95%
  }, 1000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<template>
  <div
    class="hidden cursor-default select-none items-center gap-4 text-nowrap rounded-full px-3 py-1 text-sm font-extrabold transition-colors duration-100 ease-in-out hover:bg-secondary lg:flex"
  >
    <span>CPU: {{ cpuUsage }}</span>
    <span>Mem: {{ memoryUsage }}</span>
  </div>
</template>

<style scoped></style>
