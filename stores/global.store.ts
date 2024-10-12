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
    loginView: "selectUser",
    username: "Gianluca",
    isAuthenticated: false,
    
    // Boot states
    // isSuspended: false,
    isPowerOffModalOpen: false,
    isRestartModalOpen: false,
    isLogoutModalOpen: false, 
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

    // Boot handlers
    async boot() {
      // Reset some state
      this.isAuthenticated = false;
      this.isPowerOffMenuOpen = false;
      this.isRestartModalOpen = false;
      this.isPowerOffModalOpen = false;
      this.isLogoutModalOpen = false;
      this.loginView = "selectUser";

      await navigateTo("/booting");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    },
    async handlePoweroff() {
      await this.boot();
      await navigateTo("poweroff");
    },
    async handlePowerUp() {
      await this.boot();
      await navigateTo("login");
    },
    async handleRestart() {
      await this.boot();
      await navigateTo("/"); // blank page
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await navigateTo("booting");
      await this.boot();
      await navigateTo("login");
    },
    async handleSuspend() {
      console.log("suspended");
    },
    handleLogout() {
      console.log("handleLogout");
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
  loginView: "selectUser" | "enterPassword" | "addUser";
  username: string;
  isAuthenticated: boolean;

  // Boot states
  // isSuspended: boolean;
  isPowerOffModalOpen: boolean;
  isRestartModalOpen: boolean;
  isLogoutModalOpen: boolean;
}
