<script setup lang="ts">
import { useGlobalStore } from "~/stores/global.store";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();

const { volume, isPowerOffMenuOpen, isAnyTopbarMenuOpen } =
  storeToRefs(globalStore);
</script>

<template>
  <div
    class="topbar-menu-transition mb-4 mt-2 flex min-h-8 items-center gap-4"
    :class="[isAnyTopbarMenuOpen ? 'brightness-75' : '']"
  >
    <Icon v-show="volume[0] > 50" name="material-symbols:volume-up" size="24" />
    <Icon
      v-show="volume[0] > 0 && volume[0] <= 50"
      name="material-symbols:volume-down"
      size="24"
    />
    <Icon
      v-show="volume[0] === 0"
      name="material-symbols:volume-off"
      size="24"
    />
    <Slider
      v-model="volume"
      :disabled="isAnyTopbarMenuOpen"
      :default-value="volume"
      :max="100"
      :step="1"
    />
  </div>
</template>

<style scoped></style>
