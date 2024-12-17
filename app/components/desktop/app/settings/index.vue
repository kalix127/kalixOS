<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { storeToRefs } from "pinia";

import SettingsTabWifi from "./TabWifi.vue";
import SettingsTabNetwork from "./TabNetwork.vue";
import SettingsTabBluetooth from "./TabBluetooth.vue";
import SettingsTabDisplays from "./TabDisplays.vue";
import SettingsTabSound from "./TabSound.vue";
import SettingsTabPower from "./TabPower.vue";
import SettingsTabAppearance from "./TabAppearance.vue";
import SettingsTabSystem from "./TabSystem.vue";
import SettingsTabDefault from "./TabDefault.vue";
import SettingsTabPrinters from "./TabPrinters.vue";

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

const isMobile = useBreakpoints(breakpointsTailwind).smaller("sm");

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

const currentComponent = computed(() => 
  settingsTabsMap[currentSettingsTab.value as keyof typeof settingsTabsMap] ?? SettingsTabDefault
);

onUnmounted(() => {
  currentSettingsTab.value = null;
});
</script>

<template>
  <div
    class="grid h-full w-full grid-cols-1 grid-rows-[auto_1fr_1fr] bg-background transition-all duration-300 md:grid-cols-[minmax(min-content,25%)_1fr] md:grid-rows-[auto_1fr]"
    :class="{
      'rounded-t-xl': !isFullscreen,
      'brightness-[0.85]': !isActive,
    }"
  >
    <!-- Sidebar -->
    <SettingsSidebar
      v-if="!isMobile || !currentSettingsTab"
      :style="{
        height: `${localHeight}px`,
      }"
      class="col-span-1 row-start-2 bg-muted md:col-start-1 md:row-span-2 md:row-start-1"
      :class="{
        'rounded-tl-xl': !isFullscreen && !isMobile,
      }"
    />

    <!-- Topbar -->
    <SettingsTopBar
      @minimize="$emit('minimize')"
      @fullscreen="$emit('fullscreen')"
      @close="$emit('close')"
      class="col-span-1 row-start-1 md:col-start-2 md:row-start-1"
      @mouseenter.stop="() => setDraggable(true)"
      @mouseleave.stop="() => setDraggable(false)"
    />

    <!-- Content -->
    <div
      v-if="!isMobile || currentSettingsTab"
      :style="{
        height: `${localHeight - 40}px`,
      }"
      class="col-span-1 row-start-3 flex flex-col items-center justify-start overflow-hidden md:col-start-2 md:row-start-2"
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
