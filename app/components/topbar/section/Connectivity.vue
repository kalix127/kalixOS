<script setup lang="ts">
const { t } = useI18n();

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
  isBluetoothMenuOpen,
  getTopbarMenuOpen,
  connectedWifiNetwork,
} = storeToRefs(globalStore);

const { toggleWifi } = globalStore;

const items = computed(() => [
  {
    model: isWiredEnabled,
    menu: true,
    name: t("wired"),
    label: "wired",
    icon: "gnome:wired-on",
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
    name: t("wifi"),
    label: "wifi",
    icon: isWifiEnabled.value
      ? connectedWifiNetwork.value
        ? `gnome:wifi-${connectedWifiNetwork.value?.signal || 1}`
        : "gnome:wifi-not-connected"
      : "gnome:wifi-off",
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
    name: t("bluetooth"),
    label: "bluetooth",
    icon: isBluetoothEnabled.value
      ? "gnome:bluetooth-on"
      : "gnome:bluetooth-off",
    handler: () => {
      isBluetoothEnabled.value = !isBluetoothEnabled.value;
    },
    menuHandler: () => {
      isBluetoothMenuOpen.value = !isBluetoothMenuOpen.value;
    },
    get isActive() {
      return isBluetoothEnabled.value;
    },
  },
  {
    model: isAirplaneModeEnabled,
    name: t("airplane_mode"),
    icon: isAirplaneModeEnabled.value
      ? "gnome:airplane-mode-on"
      : "gnome:airplane-mode-off",
    handler: () => {
      isAirplaneModeEnabled.value = !isAirplaneModeEnabled.value;
      isWifiEnabled.value = false;
      connectedWifiNetwork.value = null;
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
    :class="{ 'brightness-75': isAnyTopbarMenuOpen }"
  >
    <div
      v-for="item in items"
      :key="item.name"
      class="flex h-11 items-center sm:h-12"
    >
      <button
        class="flex h-full w-full items-center justify-start gap-2 rounded-l-full p-2 px-4"
        :class="[
          item.isActive
            ? 'bg-primary/80 hover:bg-primary/90'
            : 'bg-secondary/80 hover:bg-secondary-hover',
          !item.menu ? 'rounded-full' : '',
        ]"
        @click="item.handler"
      >
        <Icon :name="item.icon" size="16" />

        <!-- Only for the Wifi Button -->
        <div class="flex flex-col items-start" v-if="item.label === 'wifi'">
          <span class="text-sm font-extrabold">
            {{ item.name }}
          </span>
          <span
            v-if="connectedWifiNetwork"
            class="w-40 truncate text-start text-xs sm:w-20"
          >
            {{ connectedWifiNetwork.name }}
          </span>
        </div>

        <span v-else class="text-nowrap text-sm font-extrabold">
          {{ item.name }}
        </span>
      </button>

      <button
        v-if="item.menu"
        :disabled="getTopbarMenuOpen === item.label || !item.model.value"
        class="grid h-full place-content-center rounded-r-full border-l p-2 py-2"
        :class="[
          item.isActive
            ? 'bg-primary/90 hover:bg-primary'
            : 'bg-accent/60 hover:bg-accent-hover/60',
          item.isActive ? 'border-white/40' : 'border-white/10',
        ]"
        @click="item.menuHandler"
      >
        <Icon name="gnome:arrow-long-right" size="18" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
