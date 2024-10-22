<script setup lang="ts">
const globalStore = useGlobalStore();

const { handlePowerUp } = globalStore;
</script>

<template>
  <div class="grid h-full min-h-[100vh] place-content-center bg-black">
    <div class="group relative inline-flex">
      <div
        class="transitiona-all absolute -inset-px rounded-full bg-primary opacity-70 blur-xl duration-1000 group-active:-inset-1 group-active:opacity-100 group-active:duration-100 group-hover:opacity-90"
      ></div>
      <button
        class="relative inline-flex items-center justify-center rounded-full bg-secondary group-hover:bg-secondary/95 p-7 transition-all duration-200"
        @click="handlePowerUp"
      >
        <Icon name="fa6-solid:power-off" size="72" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
