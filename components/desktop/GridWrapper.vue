<script setup lang="ts">
defineEmits(["context"]);
</script>

<template>
  <div
    @contextmenu.prevent="$emit('context', $event)"
    class="desktop-grid-wrapper hide-scrollbar z-[2] w-full overflow-y-scroll px-4 py-2 md:px-6"
    :style="{
      height: `calc(100svh - 35px)`,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.desktop-grid-wrapper {
  @apply grid gap-16 sm:gap-8;

  @apply grid-cols-[repeat(auto-fill,minmax(90px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] sm:grid-rows-[repeat(auto-fill,minmax(100px,1fr))];
}
</style>
