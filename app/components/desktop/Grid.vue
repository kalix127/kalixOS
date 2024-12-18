<script setup lang="ts">
defineEmits(["context"]);
</script>

<template>
  <div
    class="desktop-grid-wrapper hide-scrollbar z-[2] w-full overflow-y-scroll py-6 mt-[36px]"
    :style="{
      height: `calc(100svh - 36px)`,
    }"
    @contextmenu.prevent="$emit('context', $event)"
  >
    <slot />
  </div>
</template>

<style scoped>
.desktop-grid-wrapper {
  @apply grid gap-16 sm:gap-8;

  @apply grid-cols-[repeat(auto-fill,minmax(90px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] grid-rows-[repeat(auto-fill,minmax(100px,1fr))];
}
</style>
