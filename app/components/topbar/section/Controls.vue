<script setup lang="ts">
const globalStore = useGlobalStore();

const { volume, inputVolume, isAnyTopbarMenuOpen, currentSettingsTab }
  = storeToRefs(globalStore);

const { openApp } = useDesktopStore();

function handleOpenSettings() {
  currentSettingsTab.value = "sound";
  openApp("settings");
}
</script>

<template>
  <div
    class="topbar-menu-transition mb-4 mt-2 space-y-2"
    :class="{ 'brightness-75': isAnyTopbarMenuOpen }"
  >
    <!-- Volume slider -->
    <div class="flex min-h-8 items-center gap-4">
      <IconVolume
        :volume="volume[0] ?? 0"
        :size="20"
      />
      <Slider
        v-model="volume"
        :disabled="isAnyTopbarMenuOpen"
        :default-value="volume"
        :max="100"
        :step="1"
      />

      <Button
        variant="ghost"
        size="icon"
        class="size-fit rounded-full p-1 hover:bg-secondary"
        @click="handleOpenSettings"
      >
        <Icon
          name="gnome:arrow-long-right"
          size="18"
        />
      </Button>
    </div>

    <!-- Microphone slider -->
    <div class="flex min-h-8 items-center gap-4">
      <IconMicrophone
        :input-volume="inputVolume[0] ?? 0"
        :size="20"
      />
      <Slider
        v-model="inputVolume"
        :disabled="isAnyTopbarMenuOpen"
        :default-value="inputVolume"
        :max="100"
        :step="1"
      />

      <Button
        variant="ghost"
        size="icon"
        class="size-fit rounded-full p-1 hover:bg-secondary"
        @click="handleOpenSettings"
      >
        <Icon
          name="gnome:arrow-long-right"
          size="18"
        />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
