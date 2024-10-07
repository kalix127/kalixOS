import { defineStore } from "pinia";
import type { WifiNetwork } from "@/types";
import { generateRandomWifiDelays } from "@/lib/utils";

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
      this.availableWifiNetworks = []; // Reset available networks
      const totalTime = 5000; // 5 seconds in total to add all the networks

      // Generate random delays for each network
      const randomDelays = generateRandomWifiDelays(
        fakeNetworks.length,
        totalTime,
      );

      for (let i = 0; i < fakeNetworks.length; i++) {
        if (!this.isWifiEnabled) break;
        await this.addNetworkWithDelay(fakeNetworks[i], randomDelays[i]);
      }
      this.isSearchingWifiNetworks = false;
    },

    // Helper function to add network after delay
    addNetworkWithDelay(network: WifiNetwork, delay: number) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.availableWifiNetworks.push(network);
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
