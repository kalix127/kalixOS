<script setup lang="ts">
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";
import { vOnClickOutside } from "@vueuse/components";
import type { WifiNetwork } from "@/types";

const globalStore = useGlobalStore();
const {
  isWifiEnabled,
  isWifiMenuOpen,
  isConnectingToWifi,
  isSearchingWifiNetworks,
  availableWifiNetworks,
  connectedWifiNetwork,
} = storeToRefs(globalStore);

// The ID of the network we are currently connecting to
const idConnectingNetwork = ref<number | null>(null);

function closeWifiMenu() {
  isWifiMenuOpen.value = false;
}

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
    // TODO: Add toaster after connecting to a network

    // If the network we are trying to connect to is not the same as the one we are connecting to, return
    if (idConnectingNetwork.value !== network.id) {
      return;
    }

    connectedWifiNetwork.value = network;
    idConnectingNetwork.value = null;
    isConnectingToWifi.value = false;
  }, 3000);
}
</script>

<template>
  <Collapsible :open="isWifiMenuOpen">
    <CollapsibleContent v-on-click-outside="closeWifiMenu">
      <div class="select-none space-y-4 rounded-2xl bg-accent p-4">
        <div class="flex items-center gap-4">
          <div
            class="grid place-content-center rounded-full p-2"
            :class="[isWifiEnabled ? 'bg-primary' : 'bg-accent-light']"
          >
            <Icon name="ic:baseline-signal-wifi-4-bar" size="24" />
          </div>
          <span class="text-xl font-bold">Wi-Fi</span>
          <Icon
            name="svg-spinners:tadpole"
            size="20"
            v-if="isSearchingWifiNetworks"
          />
        </div>
        <div class="space-y-2">
          <Button
            v-for="network in availableWifiNetworks"
            :key="network.name"
            variant="ghost"
            class="flex w-full cursor-default justify-start gap-2 rounded-xl font-medium duration-0 last:mt-2 last:rounded-none last:border-t last:border-t-accent hover:bg-accent-light last:hover:rounded-xl"
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
              name="svg-spinners:tadpole"
              size="20"
              v-show="idConnectingNetwork === network.id"
            />
          </Button>
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>

<style scoped></style>
