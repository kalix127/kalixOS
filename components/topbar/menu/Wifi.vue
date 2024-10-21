<script setup lang="ts">
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";
import type { WifiNetwork } from "@/types";
import { vOnClickOutside } from "@vueuse/components";

const globalStore = useGlobalStore();
const {
  isWifiEnabled,
  isAirplaneModeEnabled,
  isConnectingToWifi,
  isWifiMenuOpen,
  availableWifiNetworks,
  connectedWifiNetwork,
} = storeToRefs(globalStore);

// The ID of the network we are currently connecting to
const idConnectingNetwork = ref<number | null>(null);

function connectToWifi(network: WifiNetwork) {
  // If the network is already connected, disconnect
  if (connectedWifiNetwork.value?.id === network.id) {
    connectedWifiNetwork.value = null;
    return;
  }

  isConnectingToWifi.value = true;
  idConnectingNetwork.value = network.id;

  // Fake delay of 3 seconds to simulate connecting to a network
  setTimeout(() => {

    // Check if the wifi is still enabled and the airplane mode is not enabled
    if (!isWifiEnabled.value || isAirplaneModeEnabled.value) {
      isConnectingToWifi.value = false;
      idConnectingNetwork.value = null;
      return;
    }

    // If the network we are trying to connect to is not the same as the one we are connecting to, return
    if (idConnectingNetwork.value !== network.id) {
      return;
    }

    connectedWifiNetwork.value = network;
    idConnectingNetwork.value = null;
    isConnectingToWifi.value = false;
  }, 3000);
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
    icon="ic:baseline-signal-wifi-4-bar"
  >
    <Button
      v-for="network in availableWifiNetworks"
      :key="network.name"
      variant="ghost"
      class="flex w-full cursor-default justify-start gap-2 rounded-xl font-medium duration-0 hover:bg-accent"
      @click="() => connectToWifi(network)"
    >
      <Icon
        :name="`ic:baseline-signal-wifi-${network.signal}-bar${network.isProtected ? '-lock' : ''}`"
        size="18"
      />
      {{ network.name }}

      <Icon
        name="ic:outline-check"
        size="18"
        v-show="connectedWifiNetwork?.id === network.id"
      />
      <Icon
        name="mingcute:loading-fill"
        class="animate-spin"
        size="20"
        v-show="idConnectingNetwork === network.id"
      />
    </Button>
  </TopbarMenu>
</template>

<style scoped></style>
