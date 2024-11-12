<script setup lang="ts">
const globalStore = useGlobalStore();

const { volume, inputVolume, isPowerOffMenuOpen, isAnyTopbarMenuOpen } =
  storeToRefs(globalStore);
</script>

<template>
  <div
    class="topbar-menu-transition mb-4 mt-2 space-y-2"
    :class="[isAnyTopbarMenuOpen ? 'brightness-75' : '']"
  >
    <!-- Volume slider -->
    <div class="flex min-h-8 items-center gap-4">
      <Icon v-show="volume[0] > 66" name="gnome:volume-3" size="20" />
      <Icon
        v-show="volume[0] > 33 && volume[0] <= 66"
        name="gnome:volume-2"
        size="20"
      />
      <Icon
        v-show="volume[0] > 0 && volume[0] <= 33"
        name="gnome:volume-1"
        size="20"
      />
      <Icon v-show="volume[0] === 0" name="gnome:volume-off" size="20" />
      <Slider
        v-model="volume"
        :disabled="isAnyTopbarMenuOpen"
        :default-value="volume"
        :max="100"
        :step="1"
      />
    </div>

    <!-- Microphone slider -->
    <div class="flex min-h-8 items-center gap-4">
      <Icon v-show="inputVolume[0] > 50" name="gnome:microphone-2" size="20" />
      <Icon
        v-show="inputVolume[0] <= 50 && inputVolume[0] > 0"
        name="gnome:microphone-1"
        size="20"
      />
      <Icon
        v-show="inputVolume[0] === 0"
        name="gnome:microphone-off"
        size="20"
      />
      <Slider
        v-model="inputVolume"
        :disabled="isAnyTopbarMenuOpen"
        :default-value="inputVolume"
        :max="100"
        :step="1"
      />
    </div>
  </div>
</template>

<style scoped></style>
