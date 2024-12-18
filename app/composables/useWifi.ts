import type { WifiNetwork } from "@/types";
import { useTimeoutFn } from "@vueuse/core";

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
  const { t } = useI18n();

  const idConnectingNetwork = ref<number | null>(null);
  const currentNetwork = ref<WifiNetwork | null>(null);

  /**
   * Handles the completion of the WiFi connection process.
   * This function is called after the timeout expires.
   */
  function handleConnectionCompletion() {
    if (!currentNetwork.value)
      return;

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

    // Send notification
    const { addNotification } = useDesktopStore();
    addNotification(
      {
        id: `wifi-${connectedWifiNetwork.value.id}`,
        title: t("wifi_connected_title"),
        description: t("wifi_connected_description", {
          network: connectedWifiNetwork.value.name,
        }),
        icon: "gnome:wifi-4",
        isTranslated: false,
      },
      3000,
    );
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

  return {
    isConnectingToWifi,
    availableWifiNetworks,
    connectedWifiNetwork,
    isSearchingWifiNetworks,
    idConnectingNetwork,
    connectToWifi,
  };
}
