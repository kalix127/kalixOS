import { defineStore } from "pinia";
import type { WifiNetwork } from "@/types";
import { generateRandomDelays } from "@/lib/utils";
import { defaultNetworks, defaultBootDuration, desktopEnvironments } from "@/constants";
import { useIdle, watchOnce } from "@vueuse/core";
import type { SystemLog } from "@/types";
import { powerOffSystemLogs, powerUpSystemLogs } from "@/constants";

export const useGlobalStore = defineStore({
  id: "globalStore",
  state: (): GlobalStore => ({
    // General
    desktopEnvironment: desktopEnvironments[0],
    isWiredEnabled: true,
    isWifiEnabled: false,
    isBluetoothEnabled: false,
    isAirplaneModeEnabled: false,
    volume: [100],
    isLocked: false,
    isSuspended: false,

    // Topbar Menus
    isLanguageMenuOpen: false,
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
    isBooting: false,
    isPowerOffModalOpen: false,
    isRestartModalOpen: false,
    isLogoutModalOpen: false,
    systemLogs: [],
  }),
  actions: {
    // Wifi
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
      const totalTime = 2500; // 2.5 seconds in total to add all the networks

      // Generate random delays for each network
      const randomDelays = generateRandomDelays(
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

    // General handlers
    async handleLock() {
      this.isLocked = true;
    },

    async handleSuspend() {
      this.isSuspended = true;
      this.isPowerOffMenuOpen = false;

      const { idle } = useIdle(0);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Start watching after 1 seconds
      watchOnce(idle, () => {
        this.isSuspended = false;
        // TODO: Fake the wifi that re-connect to the previous wifi (if already connected)
      });
    },

    // Boot handlers
    resetBootingState() {
      this.isBooting = false;
      this.systemLogs = [];
    },
    async boot() {
      this.isBooting = true;

      // Reset some state
      this.isAuthenticated = false;
      this.isPowerOffMenuOpen = false;
      this.isRestartModalOpen = false;
      this.isPowerOffModalOpen = false;
      this.isLogoutModalOpen = false;
      this.loginView = "selectUser";

      await navigateTo("/booting");
      await new Promise((resolve) => setTimeout(resolve, defaultBootDuration));
    },

    async handlePoweroff() {
      await Promise.all([this.addSystemLogs("poweroff"), this.boot()]);
      await navigateTo("poweroff");
      this.resetBootingState();
    },
    async handlePowerUp() {
      await Promise.all([this.addSystemLogs("powerup"), this.boot()]);
      await navigateTo("login");
      this.resetBootingState();
    },
    async handleRestart() {
      await Promise.all([this.addSystemLogs("poweroff"), this.boot()]);
      await navigateTo("/"); // blank page
      // Reset the system logs
      this.systemLogs = [];
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await Promise.all([this.addSystemLogs("powerup"), this.boot()]);
      await navigateTo("login");
      this.resetBootingState();
    },
    async handleLogout() {
      // TODO: When implementing the desktop, make sure to reset the desktop store
      this.isAuthenticated = false;
      this.username = "";
      this.loginView = "selectUser";
      this.isLogoutModalOpen = false;

      await navigateTo("/login");
    },

    async addSystemLogs(type: "powerup" | "poweroff") {
      const totalTime = defaultBootDuration - 500;
      const logs = type === "powerup" ? powerUpSystemLogs : powerOffSystemLogs;

      const randomDelays = generateRandomDelays(logs.length, totalTime);

      for (let i = 0; i < logs.length; i++) {
        await this.addSystemLogWithDelay(logs[i], randomDelays[i]);
      }
    },

    addSystemLogWithDelay(log: SystemLog, delay: number) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.systemLogs.push(log);
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
        state.isWiredMenuOpen ||
        state.isLanguageMenuOpen
      );
    },
    getTopbarMenuOpen(state) {
      if (state.isPowerOffMenuOpen) return "poweroff";
      if (state.isWifiMenuOpen) return "wifi";
      if (state.isBluetoothMenuOpen) return "bluetooth";
      if (state.isWiredMenuOpen) return "wired";
      if (state.isLanguageMenuOpen) return "language";
      return "";
    },
  },
});

// Define the type for the state
interface GlobalStore {
  // General
  desktopEnvironment: string;
  isWiredEnabled: boolean;
  isWifiEnabled: boolean;
  isBluetoothEnabled: boolean;
  isAirplaneModeEnabled: boolean;
  volume: number[];
  isLocked: boolean;
  isSuspended: boolean;

  // Topbar Menus
  isLanguageMenuOpen: boolean;
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
  isBooting: boolean; // This represents if the user is booting/rebooting the system
  isPowerOffModalOpen: boolean;
  isRestartModalOpen: boolean;
  isLogoutModalOpen: boolean;
  systemLogs: SystemLog[];
}
