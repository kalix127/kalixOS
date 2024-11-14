<script lang="ts" setup>
const globalStore = useGlobalStore();
const { hasAppsAtTop } = storeToRefs(useDesktopStore());

const {
  volume,
  isWiredEnabled,
  isAirplaneModeEnabled,
  isAnyTopbarMenuOpen,
  connectedWifiNetwork,
  isShowBatteryPercentageEnabled,
} = storeToRefs(globalStore);
</script>

<template>
  <Popover>
    <PopoverTrigger
      class="flex cursor-default items-center justify-end gap-4 rounded-full px-3 py-1 transition-colors duration-100 ease-in-out hover:bg-secondary"
      :class="!hasAppsAtTop ? 'hover:bg-secondary/50' : ''"
    >
      <Icon
        v-show="connectedWifiNetwork"
        :name="`gnome:wifi-${connectedWifiNetwork?.signal || 1}`"
        class="size-[16px] sm:size-[18px]"
      />
      <Icon
        v-show="isWiredEnabled"
        name="gnome:wired-on"
        class="size-[16px] sm:size-[18px]"
      />
      <Icon
        v-show="isAirplaneModeEnabled"
        name="gnome:airplane-mode-on"
        class="size-[16px] sm:size-[18px]"
      />
      <Icon
        v-show="volume[0] > 66"
        name="gnome:volume-3"
        class="size-[16px] sm:size-[18px]"
      />
      <Icon
        v-show="volume[0] > 33 && volume[0] <= 66"
        name="gnome:volume-2"
        class="size-[16px] sm:size-[18px]"
      />
      <Icon
        v-show="volume[0] > 0 && volume[0] <= 33"
        name="gnome:volume-1"
        class="size-[16px] sm:size-[18px]"
      />
      <Icon
        v-show="volume[0] === 0"
        name="gnome:volume-off"
        class="size-[16px] sm:size-[18px]"
      />
      <div class="flex items-center gap-1">
        <Icon name="gnome:battery-full" class="size-[16px] sm:size-[18px]" />
        <span class="text-sm" v-if="isShowBatteryPercentageEnabled">100%</span>
      </div>
    </PopoverTrigger>

    <PopoverContent
      class="z-[60000] mr-1.5 mt-1.5 rounded-3xl p-0 sm:w-[400px]"
    >
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
