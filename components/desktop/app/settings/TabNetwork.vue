<script setup lang="ts">
import type { WifiNetwork, AppNode } from "@/types";

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const isWifiModalOpen = ref(false);
const selectedWifiNetwork = ref<WifiNetwork | null>(null);

const globalStore = useGlobalStore();
const {
  isWifiEnabled,
  isAirplaneModeEnabled,
  isSearchingWifiNetworks,
  availableWifiNetworks,
  connectedWifiNetwork,
  isConnectingToWifi,
} = storeToRefs(globalStore);
const { setSettingsTab, toggleWifi, toggleAirplaneMode } = globalStore;

const { connectToWifi, idConnectingNetwork } = useWifi();

function toggleWifiModal(wifiNetwork: WifiNetwork) {
  isWifiModalOpen.value = true;
  selectedWifiNetwork.value = wifiNetwork;
}

function closeWifiModal() {
  isWifiModalOpen.value = false;
}
</script>

<template>
  <DesktopAppSettingsContent :app="app">
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <!-- Toggle Wifi -->
      <DesktopAppSettingsOption :label="$t('wifi')" @click="toggleWifi">
        <template #action>
          <Switch :checked="isWifiEnabled" />
        </template>
      </DesktopAppSettingsOption>

      <!-- Saved Networks -->
      <DesktopAppSettingsOption :label="$t('saved_networks')" is-disabled>
        <template #action>
          <Icon name="gnome:arrow-long-right" size="18" />
        </template>
      </DesktopAppSettingsOption>
    </div>
  </DesktopAppSettingsContent>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
