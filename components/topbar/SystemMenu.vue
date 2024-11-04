<script lang="ts" setup>
const globalStore = useGlobalStore();
const { hasAppsAtTop } = storeToRefs(useDesktopStore());

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
    <PopoverTrigger
      class="flex cursor-default items-center justify-end gap-2 rounded-full px-3 py-1 transition-colors duration-100 ease-in-out hover:bg-secondary xs:gap-4"
      :class="!hasAppsAtTop ? 'hover:bg-secondary/50' : ''"
    >
      <Icon
        v-show="connectedWifiNetwork"
        :name="`gnome:wifi-${connectedWifiNetwork?.signal || 1}`"
        size="18"
      />
      <Icon v-show="isWiredEnabled" name="gnome:wired-on" size="18" />
      <Icon
        v-show="isAirplaneModeEnabled"
        name="gnome:airplane-mode-on"
        size="18"
      />
      <Icon v-show="volume[0] > 66" name="gnome:volume-3" size="18" />
      <Icon
        v-show="volume[0] > 33 && volume[0] <= 66"
        name="gnome:volume-2"
        size="18"
      />
      <Icon
        v-show="volume[0] > 0 && volume[0] <= 33"
        name="gnome:volume-1"
        size="18"
      />
      <Icon v-show="volume[0] === 0" name="gnome:volume-off" size="18" />
      <Icon name="gnome:battery-full" size="18" />
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
