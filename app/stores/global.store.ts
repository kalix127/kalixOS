import type { WifiNetwork } from "@/types";
import { useIdle, watchOnce } from "@vueuse/core";
import {
  defaultDimScreenThreshold,
  defaultNetworks,
  defaultUsername,
  desktopEnvironments,
} from "@/constants";
import { generateRandomDelays } from "@/helpers";

export const useGlobalStore = defineStore("globalStore", {
  state: (): GlobalStore => ({
    isUserDesktopFirstTime: useCookie("isUserDesktopFirstTime", {
      maxAge: 365 * 24 * 60 * 60 * 10,
      default: () => true,
    }).value,
    isUserFirstTime: useCookie("isUserFirstTime", {
      maxAge: 365 * 24 * 60 * 60 * 10,
      default: () => true,
    }).value,
    desktopEnvironment: desktopEnvironments[0] ?? "",
    isWiredEnabled: true,
    isWifiEnabled: false,
    isBluetoothEnabled: false,
    isAirplaneModeEnabled: false,
    volume: [100],
    inputVolume: [50],
    isLocked: false,
    isShowBatteryPercentageEnabled: false,

    isSuspended: false,
    isAboutToSuspend: false,
    suspendedPercentage: 0,
    isDimScreenEnabled: true,
    dimScreenThreshold: defaultDimScreenThreshold,

    isLanguageMenuOpen: false,
    isPowerOffMenuOpen: false,
    isWifiMenuOpen: false,
    isBluetoothMenuOpen: false,
    isWiredMenuOpen: false,

    connectedWifiNetwork: null,
    availableWifiNetworks: [],
    isConnectingToWifi: false,
    isSearchingWifiNetworks: false,

    currentSettingsTab: null,

    loginView: "selectUser",
    username: useCookie("username", {
      maxAge: 30 * 24 * 60 * 60,
      default: () => defaultUsername,
    }).value,
    isAuthenticated: useCookie("isAuthenticated", {
      maxAge: 30 * 24 * 60 * 60,
      default: () => false,
    }).value,

    memoryUsedPercentage: 0,
  }),
  actions: {
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

    async searchWifiNetworks() {
      this.isSearchingWifiNetworks = true;
      const totalTime = 5000;
      const randomDelays = generateRandomDelays(
        defaultNetworks.length,
        totalTime,
      );

      for (const [index, network] of defaultNetworks.entries()) {
        if (!this.isWifiEnabled) {
          this.isSearchingWifiNetworks = false;
          this.availableWifiNetworks = [];
          return;
        }
        await this.addNetworkWithDelay(
          network,
          randomDelays[index] ?? 0,
        );
      }
      this.isSearchingWifiNetworks = false;
    },

    addNetworkWithDelay(network: WifiNetwork, delay: number) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const isNetworkAlreadyAdded = this.availableWifiNetworks.some(
            n => n.id === network.id,
          );

          if (!isNetworkAlreadyAdded) {
            this.availableWifiNetworks.push(network);
          }

          resolve();
        }, delay);
      });
    },

    async handleLock() {
      this.isLocked = true;
    },

    async handleSuspend() {
      this.isSuspended = true;
      this.suspendedPercentage = 100;
      this.isPowerOffMenuOpen = false;

      const { idle } = useIdle(0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      watchOnce(idle, () => {
        this.isSuspended = false;
        this.isAboutToSuspend = false;
        this.suspendedPercentage = 0;
      });
    },
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

    setUserDesktopFirstTime(value: boolean) {
      this.isUserDesktopFirstTime = false;
      const isUserDesktopFirstTimeCookie = useCookie("isUserDesktopFirstTime", {
        maxAge: 30 * 24 * 60 * 60,
      });
      isUserDesktopFirstTimeCookie.value = value.toString();
    },

    setUserFirstTime(value: boolean) {
      this.isUserFirstTime = value;
      const isUserFirstTimeCookie = useCookie("isUserFirstTime", {
        maxAge: 30 * 24 * 60 * 60,
      });
      isUserFirstTimeCookie.value = value.toString();
    },

    setSettingsTab(tab: GlobalStore["currentSettingsTab"]) {
      this.currentSettingsTab = tab;
    },
  },
  getters: {
    isAnyTopbarMenuOpen(state) {
      return (
        state.isPowerOffMenuOpen
        || state.isWifiMenuOpen
        || state.isBluetoothMenuOpen
        || state.isWiredMenuOpen
        || state.isLanguageMenuOpen
      );
    },
    getTopbarMenuOpen(state) {
      if (state.isPowerOffMenuOpen)
        return "poweroff";
      if (state.isWifiMenuOpen)
        return "wifi";
      if (state.isBluetoothMenuOpen)
        return "bluetooth";
      if (state.isWiredMenuOpen)
        return "wired";
      if (state.isLanguageMenuOpen)
        return "language";
      return "";
    },
  },
});

interface GlobalStore {
  isUserDesktopFirstTime: boolean;
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

  isSuspended: boolean;
  isAboutToSuspend: boolean;
  suspendedPercentage: number;
  isDimScreenEnabled: boolean;
  dimScreenThreshold: string;

  isLanguageMenuOpen: boolean;
  isPowerOffMenuOpen: boolean;
  isWifiMenuOpen: boolean;
  isBluetoothMenuOpen: boolean;
  isWiredMenuOpen: boolean;

  connectedWifiNetwork: WifiNetwork | null;
  availableWifiNetworks: WifiNetwork[];
  isConnectingToWifi: boolean;
  isSearchingWifiNetworks: boolean;

  currentSettingsTab: string | null | undefined;

  loginView: "selectUser" | "enterPassword" | "addUser";
  username: string;
  isAuthenticated: boolean;

  memoryUsedPercentage: number;
}
