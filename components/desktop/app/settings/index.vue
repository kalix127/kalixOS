<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { AppNode } from "@/types";
import { cn } from "@/lib/utils";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  app: AppNode;
}>();

const { app } = toRefs(props);

const { currentSettingsTab } = storeToRefs(useGlobalStore());

const isMobile = useBreakpoints(breakpointsTailwind).smaller("sm");

const scrollAreaHeight = computed(() => {
  const topBarHeight = 40;
  const windowContentHeight = app.value.height - topBarHeight;
  return windowContentHeight;
});

onUnmounted(() => {
  // Reset the tab value
  currentSettingsTab.value = null;
});
</script>

<template>
  <div
    :class="
      cn(
        'grid bg-background',
        isMobile ? 'grid-cols-[1fr]' : 'grid-cols-[25%_75%]',
        app.isModalOpen ? 'pointer-events-none brightness-[0.8]' : '',
        $props.class,
      )
    "
  >
    <!-- Sidebar -->
    <SettingsSidebar
      v-if="!isMobile || !currentSettingsTab"
      :style="{
        height: `${scrollAreaHeight}px`,
      }"
      :class="[
        app.isActive ? 'bg-muted' : 'bg-muted/50',
        app.isModalOpen ? 'pointer-events-none brightness-[0.8]' : '',
      ]"
    />

    <!-- Tabs -->
    <div
      v-if="!isMobile || currentSettingsTab"
      class="flex flex-col items-center justify-start"
      :style="{
        height: `${scrollAreaHeight}px`,
      }"
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
