import { useTimeoutFn } from "@vueuse/core";
import type { WifiNetwork } from "@/types";

export function useWifi() {
  const globalStore = useGlobalStore();
  const {
    isWifiEnabled,
    isAirplaneModeEnabled,
    isConnectingToWifi,
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

    // Mark the network as saved after successful connection
    currentNetwork.value.isSaved = true;

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
    // Check if the selected network is already connected
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

  function forgetConnection(network: WifiNetwork) {
    if (connectedWifiNetwork.value?.id === network.id) {
      connectedWifiNetwork.value = null;
    }

    network.isSaved = false;
  }

  return {
    isConnectingToWifi,
    availableWifiNetworks,
    connectedWifiNetwork,
    isSearchingWifiNetworks,
    idConnectingNetwork,
    connectToWifi,
    forgetConnection,
  };
}
