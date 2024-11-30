import type { WifiNetwork } from "@/types";
import { generateRandomDelays } from "@/lib/utils";
import {
  defaultNetworks,
  desktopEnvironments,
  defaultDimScreenThreshold,
} from "@/constants";
import { useIdle, watchOnce } from "@vueuse/core";
import { defaultUsername } from "@/constants";

export const useGlobalStore = defineStore({
  id: "globalStore",
  state: (): GlobalStore => ({
    // General
    isUserFirstTime: useCookie("isUserFirstTime", {
      maxAge: 365 * 24 * 60 * 60 * 10,
      default: () => true,
    }).value,
    desktopEnvironment: desktopEnvironments[0],
    isWiredEnabled: true,
    isWifiEnabled: false,
    isBluetoothEnabled: false,
    isAirplaneModeEnabled: false,
    volume: [100],
    inputVolume: [50],
    isLocked: false,
    isShowBatteryPercentageEnabled: false,

    // Suspend
    isSuspended: false,
    isAboutToSuspend: false,
    suspendedPercentage: 0,
    isDimScreenEnabled: true,
    dimScreenThreshold: defaultDimScreenThreshold,

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

    // Settings
    currentSettingsTab: null,

    // Auth
    loginView: "selectUser",
    username: useCookie("username", {
      maxAge: 30 * 24 * 60 * 60,
      default: () => defaultUsername,
    }).value,
    isAuthenticated: useCookie("isAuthenticated", {
      maxAge: 30 * 24 * 60 * 60,
      default: () => false,
    }).value,

    // Terminal
    memoryUsedPercentage: 0,
  }),
  actions: {
    // Toggles
    toggleWired() {
      this.isWiredEnabled = !this.isWiredEnabled;
    },

    toggleWifi() {
      this.isWifiEnabled = !this.isWifiEnabled;
      this.availableWifiNetworks = [];

      if (!this.isWifiEnabled) {
        this.connectedWifiNetwork = null;
        return;
      }

      this.isAirplaneModeEnabled = false;
      this.searchWifiNetworks();
    },

    toggleBluetooth() {
      this.isBluetoothEnabled = !this.isBluetoothEnabled;
    },

    toggleAirplaneMode() {
      this.isAirplaneModeEnabled = !this.isAirplaneModeEnabled;
      this.isWifiEnabled = false;
      this.connectedWifiNetwork = null;
    },

    // Wifi
    async searchWifiNetworks() {
      this.isSearchingWifiNetworks = true;
      const totalTime = 5000; // 5 seconds in total to add all the networks

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
      this.suspendedPercentage = 100;
      this.isPowerOffMenuOpen = false;

      const { idle } = useIdle(0);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Start watching after 1 seconds
      watchOnce(idle, () => {
        this.isSuspended = false;
        this.isAboutToSuspend = false;
        this.suspendedPercentage = 0;
        // TODO: Fake the wifi that re-connect to the previous wifi (if already connected)
      });
    },
    // Auth

    /**
     * Sets the username and updates the corresponding cookie.
     * @param newUsername - The new username to set.
     */
    setUsername(newUsername: string) {
      this.username = newUsername;
      const usernameCookie = useCookie("username", {
        maxAge: 30 * 24 * 60 * 60,
      });
      usernameCookie.value = newUsername;
    },

    setIsAuthenticated(value: boolean) {
      this.isAuthenticated = value;
      const isAuthenticatedCookie = useCookie("isAuthenticated", {
        maxAge: 30 * 24 * 60 * 60,
      });
      isAuthenticatedCookie.value = value.toString();
    },

    setUserFirstTime(value: boolean) {
      this.isUserFirstTime = false;
      const isUserFirstTimeCookie = useCookie("isUserFirstTime", {
        maxAge: 30 * 24 * 60 * 60,
      });
      isUserFirstTimeCookie.value = value.toString();
    },

    // Settings
    setSettingsTab(tab: GlobalStore["currentSettingsTab"]) {
      this.currentSettingsTab = tab;
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
  isUserFirstTime: boolean;
  desktopEnvironment: string;
  isWiredEnabled: boolean;
  isWifiEnabled: boolean;
  isBluetoothEnabled: boolean;
  isAirplaneModeEnabled: boolean;
  volume: number[];
  inputVolume: number[];
  isLocked: boolean;
  isShowBatteryPercentageEnabled: boolean;

  // Suspend
  isSuspended: boolean;
  isAboutToSuspend: boolean;
  suspendedPercentage: number;
  isDimScreenEnabled: boolean;
  dimScreenThreshold: string;

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

  // Settings
  currentSettingsTab: string | null | undefined;

  // Auth
  loginView: "selectUser" | "enterPassword" | "addUser";
  username: string;
  isAuthenticated: boolean;

  // Terminal
  memoryUsedPercentage: number;
}
