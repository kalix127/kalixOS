<script lang="ts" setup>
import { useGlobalStore } from "~/stores/global.store";
import { storeToRefs } from "pinia";
import { type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const globalStore = useGlobalStore();

const {
  volume,
  isWiredEnabled,
  isAirplaneModeEnabled,
  isAnyTopbarMenuOpen,
  connectedWifiNetwork,
} = storeToRefs(globalStore);

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <Popover>
    <PopoverTrigger
      :class="
        cn(
          'flex cursor-default items-center justify-end gap-2 rounded-full px-3 py-1 transition-colors duration-100 ease-in-out hover:bg-secondary xs:gap-4',
          props.class,
        )
      "
    >
      <Icon
        v-show="connectedWifiNetwork"
        :name="`ic:baseline-signal-wifi-${connectedWifiNetwork?.signal}-bar`"
        size="18"
      />
      <Icon v-show="isWiredEnabled" name="lucide:ethernet-port" size="18" />
      <Icon
        v-show="isAirplaneModeEnabled"
        name="ion:airplane-sharp"
        size="18"
      />
      <Icon
        v-show="volume[0] > 50"
        name="material-symbols:volume-up"
        size="18"
      />
      <Icon
        v-show="volume[0] > 0 && volume[0] <= 50"
        name="material-symbols:volume-down"
        size="18"
      />
      <Icon
        v-show="volume[0] === 0"
        name="material-symbols:volume-off"
        size="18"
      />
      <Icon name="mdi:battery-charging" size="18" />
    </PopoverTrigger>

    <PopoverContent class="mr-1.5 mt-1.5 rounded-3xl p-0 sm:w-[400px]">
      <div
        :class="[isAnyTopbarMenuOpen ? 'bg-background' : '']"
        class="topbar-menu-transition flex flex-1 flex-col rounded-3xl p-4"
      >
        <!-- User Actions -->
        <TopbarSectionUserActions />

        <!-- User actions menus -->
        <TopbarMenuPowerOff />
        <TopbarMenuLanguage />

        <!-- Sliders -->
        <TopbarSectionControls />

        <!-- Wifi, Bluetooth, Dark theme, Airplane mode buttons -->
        <TopbarSectionConnectivity />

        <!-- Wifi, Wired and bluetooth menu -->
        <TopbarMenuWired />
        <TopbarMenuWifi />
        <TopbarMenuBluetooth />
      </div>
    </PopoverContent>
  </Popover>
</template>
