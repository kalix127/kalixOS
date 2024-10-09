<script setup lang="ts">
import { useGlobalStore } from "~/stores/global.store";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();

const {
  volume,
  isWifiEnabled,
  isWiredEnabled,
  isBluetoothEnabled,
  isAirplaneModeEnabled,
  isAnyTopbarMenuOpen,
  isWifiMenuOpen,
  isWiredMenuOpen,
  getTopbarMenuOpen,
  connectedWifiNetwork,
} = storeToRefs(globalStore);

const { toggleWifi } = globalStore;

const items = computed(() => [
  {
    model: isWiredEnabled,
    menu: true,
    name: "Wired",
    label: "wired",
    icon: "lucide:ethernet-port",
    handler: () => {
      isWiredEnabled.value = !isWiredEnabled.value;
      isAirplaneModeEnabled.value = false; // disable airplane mode when wired is toggled
    },
    menuHandler: () => {
      isWiredMenuOpen.value = !isWiredMenuOpen.value;
    },
    get isActive() {
      return isWiredEnabled.value;
    },
  },
  {
    model: isWifiEnabled,
    menu: true,
    name: "Wi-Fi",
    label: "wifi",
    icon: isWifiEnabled.value
      ? connectedWifiNetwork.value
        ? `ic:baseline-signal-wifi-${connectedWifiNetwork.value?.signal}-bar`
        : "ic:baseline-wifi-find"
      : "ic:baseline-signal-wifi-connected-no-internet-4",
    handler: () => {
      toggleWifi();
    },
    menuHandler: () => {
      isWifiMenuOpen.value = !isWifiMenuOpen.value;
    },
    get isActive() {
      return isWifiEnabled.value;
    },
  },
  {
    model: isBluetoothEnabled,
    menu: true,
    name: "Bluetooth",
    label: "bluetooth",
    icon: isBluetoothEnabled.value
      ? "material-symbols:bluetooth"
      : "material-symbols:bluetooth-disabled",
    handler: () => {
      isBluetoothEnabled.value = !isBluetoothEnabled.value;
    },
    get isActive() {
      return isBluetoothEnabled.value;
    },
  },
  {
    model: isAirplaneModeEnabled.value,
    name: "Airplane mode",
    icon: "ion:airplane-sharp",
    handler: () => {
      isAirplaneModeEnabled.value = !isAirplaneModeEnabled.value;
      isWifiEnabled.value = false; // disable wifi when airplane mode is toggled
    },
    get isActive() {
      return isAirplaneModeEnabled.value;
    },
  },
]);
</script>

<template>
  <div
    class="topbar-menu-transition grid grid-cols-1 gap-3 sm:grid-cols-2"
    :class="[isAnyTopbarMenuOpen ? 'brightness-75' : '']"
  >
    <div
      v-for="item in items"
      :key="item.name"
      class="flex max-h-12 min-h-12 items-center"
    >
      <button
        class="flex h-full w-full cursor-default items-center justify-start gap-2.5 rounded-l-full p-2 px-4"
        :class="[
          item.isActive
            ? 'bg-primary/80 hover:bg-primary/90'
            : 'bg-secondary/80 hover:bg-secondary-hover',
          !item.menu ? 'rounded-full' : '',
        ]"
        @click="item.handler"
      >
        <Icon
          :name="item.icon"
          size="18"
          :class="[item.isActive ? '' : 'bg-muted-foreground']"
        />

        <!-- Only for the Wifi Button -->
        <div class="flex flex-col items-start" v-if="item.label === 'wifi'">
          <span class="text-sm font-bold">
            {{ item.name }}
          </span>
          <span
            v-if="connectedWifiNetwork"
            class="w-40 truncate text-start text-xs sm:w-20"
          >
            {{ connectedWifiNetwork.name }}
          </span>
        </div>

        <span v-else class="text-nowrap text-sm font-bold">
          {{ item.name }}
        </span>
      </button>

      <button
        v-if="item.menu"
        :disabled="getTopbarMenuOpen === item.label || !item.model.value"
        class="grid h-full cursor-default place-content-center rounded-r-full border-l p-2 py-2"
        :class="[
          item.isActive
            ? 'bg-primary/90 hover:bg-primary'
            : 'hover:bg-accent-hover/60 bg-accent/60',
          item.isActive ? 'border-white/40' : 'border-white/10',
        ]"
        @click="item.menuHandler"
      >
        <Icon name="ion:arrow-forward-outline" size="18" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
