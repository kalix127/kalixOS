<script lang="ts" setup>
const globalStore = useGlobalStore();

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
      :aria-label="$t('seo.aria.system_menu')"
      class="flex h-7 items-center justify-end gap-4 rounded-full px-3 py-1 transition-colors duration-100 ease-in-out hover:bg-secondary/50"
    >
      <IconWifi
        v-show="connectedWifiNetwork"
        :network="connectedWifiNetwork"
        :size="18"
      />
      <Icon v-show="isWiredEnabled" name="gnome:wired-on" :size="16" />
      <Icon
        v-show="isAirplaneModeEnabled"
        name="gnome:airplane-mode-on"
        :size="16"
      />
      <IconVolume :volume="volume[0] ?? 0" :size="16" />
      <div class="flex items-center gap-1">
        <Icon name="gnome:battery-full" :size="16" />
        <span class="text-sm" v-if="isShowBatteryPercentageEnabled">100%</span>
      </div>
    </PopoverTrigger>

    <LazyPopoverContent
      class="z-[60000] mr-1.5 mt-1.5 rounded-3xl p-0 sm:w-[400px]"
    >
      <div
        :class="{ 'bg-background': isAnyTopbarMenuOpen }"
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
    </LazyPopoverContent>
  </Popover>
</template>
