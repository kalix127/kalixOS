import { defineStore } from "pinia";

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

    // Auth
    isAuthenticated: false,
  }),
  actions: {},
  getters: {
    isAnyTopbarMenuOpen(state) {
      return (
        state.isPowerOffMenuOpen ||
        state.isWifiMenuOpen ||
        state.isBluetoothMenuOpen ||
        state.isWiredMenuOpen
      );
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

  // Auth
  isAuthenticated: boolean;
}
