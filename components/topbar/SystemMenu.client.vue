<script lang="ts" setup>
import { useGlobalStore } from "~/stores/global.store";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();

const {
  volume,
  isWiredEnabled,
  isAirplaneModeEnabled,
  isAnyTopbarMenuOpen,
  connectedWifiNetwork,
} = storeToRefs(globalStore);
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <div
        class="flex cursor-default items-center justify-end gap-2 rounded-full px-3 py-1 transition-colors duration-100 ease-in-out hover:bg-secondary xs:gap-4"
      >
        <Icon
          v-show="connectedWifiNetwork"
          :name="`ic:baseline-signal-wifi-${connectedWifiNetwork?.signal}-bar`"
          size="18"
        />
        <Icon v-show="isWiredEnabled" name="lucide:ethernet-port" size="18" />
        <Icon
          v-show="isAirplaneModeEnabled"
          name="ic:baseline-airplanemode-active"
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
      </div>
    </PopoverTrigger>

    <PopoverContent class="mr-1.5 mt-1.5 rounded-3xl p-0 sm:w-[400px]">
      <div
        :class="[isAnyTopbarMenuOpen ? 'bg-background' : '']"
        class="topbar-menu-transition flex flex-1 flex-col rounded-3xl p-4"
      >
        <!-- User Actions -->
        <TopbarSectionUserActions />

        <!-- TODO: Fix the gap created on those menus -->
        <TopbarMenuPowerOff />

        <!-- Sliders -->
        <TopbarSectionControls />

        <!-- Wifi, Bluetooth, Dark theme, Airplane mode buttons -->
        <TopbarSectionConnectivity />

        <!-- Wifi, Wired and bluetooth menu -->
        <TopbarMenuWired />
        <TopbarMenuWifi />
      </div>
    </PopoverContent>
  </Popover>
</template>
