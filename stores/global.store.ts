import { defineStore } from "pinia";
import type { WifiNetwork } from "@/types";
import { generateRandomWifiDelays } from "@/lib/utils";
import { defaultNetworks } from "@/constants";

export const useGlobalStore = defineStore({
  id: "globalStore",
  state: (): GlobalStore => ({
    // General
    isWiredEnabled: true,
    isWifiEnabled: false,
    isBluetoothEnabled: false,
    isAirplaneModeEnabled: false,
    volume: [100],

    // Topbar Menus
    isPowerOffMenuOpen: false,
    isWifiMenuOpen: false,
    isBluetoothMenuOpen: false,
    isWiredMenuOpen: false,

    // Wifi
    connectedWifiNetwork: null,
    availableWifiNetworks: [],
    isConnectingToWifi: false,
    isSearchingWifiNetworks: false,

    // Auth
    isAuthenticated: false,
  }),
  actions: {
    toggleWifi() {
      this.isWifiEnabled = !this.isWifiEnabled;
      this.availableWifiNetworks = [];

      if (this.isWifiEnabled) {
        this.isAirplaneModeEnabled = false;
        this.searchWifiNetworks();
      } else {
        // If the Wifi has been disabled, reset the connected network
        this.connectedWifiNetwork = null;
      }
    },

    async searchWifiNetworks() {
      this.isSearchingWifiNetworks = true;
      const totalTime = 5000; // 5 seconds in total to add all the networks

      // Generate random delays for each network
      const randomDelays = generateRandomWifiDelays(
        defaultNetworks.length,
        totalTime,
      );

      for (let i = 0; i < defaultNetworks.length; i++) {
        // Stop if Wi-Fi gets disabled during the process
        if (!this.isWifiEnabled) {
          this.isSearchingWifiNetworks = false;
          this.availableWifiNetworks = [];
          return;
        }
        await this.addNetworkWithDelay(defaultNetworks[i], randomDelays[i]);
      }
      this.isSearchingWifiNetworks = false;
    },

    // Helper function to add network after delay
    addNetworkWithDelay(network: WifiNetwork, delay: number) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Check if the network is already present in the available list
          const isNetworkAlreadyAdded = this.availableWifiNetworks.some(
            (n) => n.id === network.id,
          );

          // If the network is not already added, add it to the list
          if (!isNetworkAlreadyAdded) {
            this.availableWifiNetworks.push(network);
          }

          resolve();
        }, delay);
      });
    },
  },
  getters: {
    isAnyTopbarMenuOpen(state) {
      return (
        state.isPowerOffMenuOpen ||
        state.isWifiMenuOpen ||
        state.isBluetoothMenuOpen ||
        state.isWiredMenuOpen
      );
    },
    getTopbarMenuOpen(state) {
      if (state.isPowerOffMenuOpen) return "poweroff";
      if (state.isWifiMenuOpen) return "wifi";
      if (state.isBluetoothMenuOpen) return "bluetooth";
      if (state.isWiredMenuOpen) return "wired";
      return "";
    },
  },
});

// Define the type for the state
interface GlobalStore {
  // General
  isWiredEnabled: boolean;
  isWifiEnabled: boolean;
  isBluetoothEnabled: boolean;
  isAirplaneModeEnabled: boolean;
  volume: number[];

  // Topbar Menus
  isPowerOffMenuOpen: boolean;
  isWifiMenuOpen: boolean;
  isBluetoothMenuOpen: boolean;
  isWiredMenuOpen: boolean;

  // Wifi
  connectedWifiNetwork: WifiNetwork | null;
  availableWifiNetworks: WifiNetwork[];
  isConnectingToWifi: boolean;
  isSearchingWifiNetworks: boolean;

  // Auth
  isAuthenticated: boolean;
}
