<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { AppNode } from "@/types";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { storeToRefs } from "pinia";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  app: AppNode;
}>();

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

const { app } = toRefs(props);

const { currentSettingsTab } = storeToRefs(useGlobalStore());

const isMobile = useBreakpoints(breakpointsTailwind).smaller("sm");

onUnmounted(() => {
  currentSettingsTab.value = null;
});
</script>

<template>
  <div
    class="grid h-full w-full grid-cols-1 grid-rows-[auto_1fr_1fr] bg-background transition-all duration-300 md:grid-cols-[minmax(min-content,25%)_1fr] md:grid-rows-[auto_1fr]"
    :class="{
      'rounded-t-xl': !app.isFullscreen,
      'brightness-[0.75]': !app.isActive,
    }"
  >
    <!-- Sidebar -->
    <SettingsSidebar
      v-if="!isMobile || !currentSettingsTab"
      :style="{ height: `${app.height}px` }"
      class="col-span-1 row-start-2 bg-muted md:col-start-1 md:row-span-2 md:row-start-1"
      :class="{
        'rounded-tl-xl': !app.isFullscreen,
      }"
    />

    <!-- Topbar -->
    <SettingsTopBar
      @minimize="$emit('minimize')"
      @fullscreen="$emit('fullscreen')"
      @close="$emit('close')"
      :app="app"
      class="app-topbar col-span-1 row-start-1 md:col-start-2 md:row-start-1"
    />

    <!-- Content -->
    <div
      v-if="!isMobile || currentSettingsTab"
      class="col-span-1 row-start-3 flex flex-col items-center justify-start md:col-start-2 md:row-start-2"
      :style="{ height: `${app.height - 40}px` }"
    >
      <Transition mode="out-in">
        <!-- Wifi -->
        <SettingsTabWifi :app="app" v-if="currentSettingsTab === 'wifi'" />

        <!-- Network -->
        <SettingsTabNetwork
          :app="app"
          v-else-if="currentSettingsTab === 'network'"
        />

        <!-- Bluetooth -->
        <SettingsTabBluetooth
          :app="app"
          v-else-if="currentSettingsTab === 'bluetooth'"
          class="grid h-full place-content-center"
        />

        <!-- Displays -->
        <SettingsTabDisplays
          :app="app"
          v-else-if="currentSettingsTab === 'displays'"
        />

        <!-- Sound -->
        <SettingsTabSound
          :app="app"
          v-else-if="currentSettingsTab === 'sound'"
        />

        <!-- Power -->
        <SettingsTabPower
          :app="app"
          v-else-if="currentSettingsTab === 'power'"
        />

        <!-- Appearance -->
        <SettingsTabAppearance
          :app="app"
          v-else-if="currentSettingsTab === 'appearance'"
        />

        <!-- Printers -->
        <SettingsTabPrinters
          :app="app"
          v-else-if="currentSettingsTab === 'printers'"
          class="grid h-full place-content-center"
        />

        <!-- System -->
        <SettingsTabSystem
          :app="app"
          v-else-if="currentSettingsTab === 'system'"
        />

        <!-- Default -->
        <SettingsTabDefault
          :app="app"
          v-else
          class="grid h-full place-content-center"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped></style>
