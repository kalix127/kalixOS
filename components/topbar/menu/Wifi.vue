<script setup lang="ts">
import { useTimeoutFn } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";
import type { WifiNetwork } from "@/types";

const globalStore = useGlobalStore();
const {
  isWifiEnabled,
  isAirplaneModeEnabled,
  isConnectingToWifi,
  isWifiMenuOpen,
  availableWifiNetworks,
  connectedWifiNetwork,
  isSearchingWifiNetworks,
} = storeToRefs(globalStore);

const idConnectingNetwork = ref<number | null>(null);
const currentNetwork = ref<WifiNetwork | null>(null);

/**
 * Handles the completion of the WiFi connection process.
 * This function is called after the timeout expires.
 */
function handleConnectionCompletion() {
  if (!currentNetwork.value) return;

  // Check if WiFi is still enabled and airplane mode is not active
  if (!isWifiEnabled.value || isAirplaneModeEnabled.value) {
    resetConnectionState();
    return;
  }

  // Ensure that the network being connected to hasn't changed during the timeout
  if (idConnectingNetwork.value !== currentNetwork.value.id) {
    return;
  }

  // Update the connected network and reset the connection state
  connectedWifiNetwork.value = currentNetwork.value;
  resetConnectionState();
}

function resetConnectionState() {
  isConnectingToWifi.value = false;
  idConnectingNetwork.value = null;
  currentNetwork.value = null;
}

const { start, stop } = useTimeoutFn(handleConnectionCompletion, 3000, {
  immediate: false,
});

function connectToWifi(network: WifiNetwork) {
  // If the selected network is already connected, disconnect from it
  if (connectedWifiNetwork.value?.id === network.id) {
    connectedWifiNetwork.value = null;
    return;
  }

  // If a connection attempt is already in progress, cancel it
  if (isConnectingToWifi.value) {
    stop();
  }

  // Update the connection state to indicate that a connection attempt is in progress
  isConnectingToWifi.value = true;
  idConnectingNetwork.value = network.id;
  currentNetwork.value = network;

  // Start the timeout to simulate the connection delay
  start();
}

function closeMenu() {
  isWifiMenuOpen.value = false;
}
</script>

<template>
  <TopbarMenu
    v-on-click-outside="closeMenu"
    :isOpen="isWifiMenuOpen"
    :isEnabled="isWifiEnabled"
    :title="$t('wifi')"
    icon="gnome:wifi-4"
  >
    <template #loading-icon>
      <Icon
        v-if="isSearchingWifiNetworks"
        name="extra:loading"
        class="animate-spin"
        size="20"
      />
    </template>
    <Button
      v-for="network in availableWifiNetworks"
      :key="network.id"
      variant="ghost"
      class="flex w-full cursor-pointer justify-start gap-2 rounded-xl font-medium transition-colors duration-200 hover:bg-accent"
      @click="() => connectToWifi(network)"
    >
      <Icon
        :name="`gnome:wifi-${network.signal}${network.isProtected ? '-lock' : ''}`"
        size="18"
      />
      <span>{{ network.name }}</span>

      <Icon
        name="gnome:checkmark"
        size="18"
        v-if="connectedWifiNetwork?.id === network.id"
      />
      <Icon
        name="extra:loading"
        class="animate-spin"
        size="18"
        v-if="idConnectingNetwork === network.id"
      />
    </Button>
  </TopbarMenu>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
