<script lang="ts" setup>
import { useGlobalStore } from "~/stores/global.store";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();

const {
  volume,
  isWifiEnabled,
  isWiredEnabled,
  isBluetoothEnabled,
  isAirplaneModeEnabled,
  isPowerOffMenuOpen,
  isAnyTopbarMenuOpen,
  isWifiMenuOpen,
  getTopbarMenuOpen,
  connectedWifiNetwork,
} = storeToRefs(globalStore);

const { toggleWifi } = globalStore;

const topItems = [
  {
    name: "Settings",
    icon: "material-symbols:settings-rounded",
    handler: () => {
      console.log("Settings");
    },
  },
  {
    name: "Lock",
    icon: "material-symbols:lock",
    handler: () => {
      console.log("Lock");
    },
  },
  {
    name: "Poweroff",
    icon: "material-symbols:power-settings-new-rounded",
    handler: () => {
      isPowerOffMenuOpen.value = !isPowerOffMenuOpen.value;
    },
  },
];

const bottomItems = computed(() => [
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
    icon: isAirplaneModeEnabled.value
      ? "ic:baseline-airplanemode-active"
      : "ic:baseline-airplanemode-inactive",
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
  <Popover>
    <PopoverTrigger>
      <div
        class="flex items-center justify-end gap-2 rounded-full px-3 py-1 transition-colors duration-100 ease-in-out hover:bg-secondary xs:gap-4"
      >
        <Icon
          v-show="connectedWifiNetwork"
          :name="`ic:baseline-signal-wifi-${connectedWifiNetwork?.signal}-bar`"
          size="18"
        />
        <Icon v-show="isWiredEnabled" name="lucide:ethernet-port" size="18" />
        <Icon
          v-show="isBluetoothEnabled"
          name="material-symbols:bluetooth"
          size="18"
        />
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
        class="topbar-menu-transition flex flex-1 flex-col p-4"
      >
        <!-- Top items -->
        <div
          class="topbar-menu-transition flex justify-between gap-4"
          :class="[isAnyTopbarMenuOpen ? 'brightness-75' : '']"
        >
          <!-- Battery item -->
          <button
            variant="ghost"
            class="flex select-none items-center space-x-2 rounded-full bg-secondary p-2 px-3"
            :disabled="isAnyTopbarMenuOpen"
          >
            <Icon name="mdi:battery-charging" size="20" />
            <span class="text-sm font-semibold">100%</span>
          </button>

          <!-- Lock, settings and poweroff buttons -->
          <div class="flex gap-4">
            <Button
              v-for="item in topItems"
              :key="item.name"
              :disabled="isAnyTopbarMenuOpen"
              size="icon"
              variant="ghost"
              class="rounded-full bg-secondary"
              @click="item.handler"
            >
              <Icon :name="item.icon" size="18" />
            </Button>
          </div>
        </div>

        <!-- TODO: Fix the gap created on those menus -->
        <TopbarMenuPowerOff />

        <!-- Volume slider -->
        <div
          class="topbar-menu-transition mb-4 mt-2 flex min-h-8 items-center gap-4"
          :class="[isAnyTopbarMenuOpen ? 'brightness-75' : '']"
        >
          <Icon
            v-show="volume[0] > 50"
            name="material-symbols:volume-up"
            size="24"
          />
          <Icon
            v-show="volume[0] > 0 && volume[0] <= 50"
            name="material-symbols:volume-down"
            size="24"
          />
          <Icon
            v-show="volume[0] === 0"
            name="material-symbols:volume-off"
            size="24"
          />
          <Slider
            v-model="volume"
            :disabled="isAnyTopbarMenuOpen"
            :default-value="volume"
            :max="100"
            :step="1"
          />
        </div>

        <!-- Wifi, Bluetooth, Dark theme, Airplane mode buttons -->
        <div
          class="topbar-menu-transition grid grid-cols-1 gap-2 sm:grid-cols-2"
          :class="[isAnyTopbarMenuOpen ? 'brightness-75' : '']"
        >
          <div
            v-for="item in bottomItems"
            :key="item.name"
            class="flex max-h-12 min-h-12 items-center"
          >
            <button
              class="flex h-full w-full items-center justify-start gap-2.5 rounded-l-full p-2 px-4 transition-all duration-500 ease-in-out"
              :class="[
                item.isActive ? 'bg-primary' : 'bg-secondary',
                !item.menu ? 'rounded-full' : '',
              ]"
              @click="item.handler"
            >
              <Icon :name="item.icon" size="18" />

              <!-- Only for the Wifi Button -->
              <div
                class="flex flex-col items-start"
                v-if="item.label === 'wifi'"
              >
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

            <Button
              v-if="item.menu"
              :disabled="getTopbarMenuOpen === item.label || !item.model.value"
              class="grid h-full place-content-center rounded-r-full border-l border-white/50 p-2 py-2 transition-all duration-500 ease-in-out"
              :class="[item.isActive ? 'bg-primary' : 'bg-secondary']"
              @click="item.menuHandler"
            >
              <Icon name="ion:arrow-forward-outline" size="18" />
            </Button>
          </div>
        </div>

        <!-- Wifi, Wired and bluetooth menu -->
        <TopbarMenuWifi />
      </div>
    </PopoverContent>
  </Popover>
</template>

<style scoped>
.bg-secondary {
  background-color: #464647;
}

.bg-secondary:hover {
  background-color: #4e4e4e;
}

.topbar-menu-transition {
  @apply transition-all duration-300 ease-in-out;
}
</style>
