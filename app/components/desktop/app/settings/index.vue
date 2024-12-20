<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { storeToRefs } from "pinia";

import SettingsTabAppearance from "./TabAppearance.vue";
import SettingsTabBluetooth from "./TabBluetooth.vue";
import SettingsTabDefault from "./TabDefault.vue";
import SettingsTabDisplays from "./TabDisplays.vue";
import SettingsTabNetwork from "./TabNetwork.vue";
import SettingsTabPower from "./TabPower.vue";
import SettingsTabPrinters from "./TabPrinters.vue";
import SettingsTabSound from "./TabSound.vue";
import SettingsTabSystem from "./TabSystem.vue";
import SettingsTabWifi from "./TabWifi.vue";

defineProps<{
  class?: HTMLAttributes["class"];
}>();

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

const isFullscreen = inject("isFullscreen") as Ref<boolean>;
const isActive = inject("isActive") as Ref<boolean>;
const localHeight = inject("localHeight") as Ref<number>;
const setDraggable = inject("setDraggable") as (value: boolean) => void;

const { currentSettingsTab } = storeToRefs(useGlobalStore());

const settingsTabsMap = {
  wifi: SettingsTabWifi,
  network: SettingsTabNetwork,
  bluetooth: SettingsTabBluetooth,
  displays: SettingsTabDisplays,
  sound: SettingsTabSound,
  power: SettingsTabPower,
  appearance: SettingsTabAppearance,
  system: SettingsTabSystem,
  printers: SettingsTabPrinters,
};

const currentComponent = computed(
  () =>
    settingsTabsMap[currentSettingsTab.value as keyof typeof settingsTabsMap]
    ?? SettingsTabDefault,
);

onUnmounted(() => {
  currentSettingsTab.value = null;
});
</script>

<template>
  <div
    class="grid size-full grid-cols-[minmax(max-content,25%)_1fr] grid-rows-[auto_1fr] bg-background transition-all duration-300"
    :class="{
      'rounded-t-xl': !isFullscreen,
      'brightness-[0.85]': !isActive,
    }"
  >
    <!-- Sidebar -->
    <SettingsSidebar
      :style="{
        height: `${localHeight}px`,
      }"
      class="col-start-1 row-span-2 row-start-1 bg-muted"
      :class="{
        'rounded-tl-xl': !isFullscreen,
      }"
    />

    <!-- Topbar -->
    <SettingsTopBar
      class="col-start-2 row-start-1"
      @minimize="$emit('minimize')"
      @fullscreen="$emit('fullscreen')"
      @close="$emit('close')"
      @mouseenter.stop="() => setDraggable(true)"
      @mouseleave.stop="() => setDraggable(false)"
    />

    <!-- Content -->
    <div
      :style="{
        height: `${localHeight - 40}px`,
      }"
      class="col-start-2 row-start-2 flex flex-col items-center justify-start overflow-hidden"
    >
      <Transition mode="out-in">
        <component
          :is="currentComponent"
          :class="{
            'grid h-full place-content-center': [
              'bluetooth',
              'printers',
              'default',
            ].includes(currentSettingsTab?.toLowerCase() ?? 'default'),
          }"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped></style>
