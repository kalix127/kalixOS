import type { SystemLog } from "@/types";
import {
  defaultBootDuration,
  powerOffSystemLogs,
  powerUpSystemLogs,
} from "@/constants";
import { generateRandomDelays } from "@/helpers";

export const useBootStore = defineStore({
  id: "bootStore",
  state: (): BootStore => ({
    isBooting: false,
    isPowerOffModalOpen: false,
    isRestartModalOpen: false,
    isLogoutModalOpen: false,
    systemLogs: [] as SystemLog[],
  }),
  actions: {
    resetBootingState() {
      this.isBooting = false;
      this.systemLogs = [];
    },

    async boot() {
      this.isBooting = true;

      // Reset authentication
      const { setIsAuthenticated } = useGlobalStore();
      setIsAuthenticated(false);

      // Reset modal states
      this.isPowerOffModalOpen = false;
      this.isRestartModalOpen = false;
      this.isLogoutModalOpen = false;

      await navigateTo("/booting");
      await new Promise(resolve => setTimeout(resolve, defaultBootDuration));
    },

    async handlePoweroff() {
      await Promise.all([this.addSystemLogs("poweroff"), this.boot()]);
      await navigateTo("/poweroff");
      this.resetBootingState();
    },

    async handlePowerUp() {
      await Promise.all([this.addSystemLogs("powerup"), this.boot()]);
      await navigateTo("/login");
      this.resetBootingState();
    },

    async handleRestart() {
      await Promise.all([this.addSystemLogs("poweroff"), this.boot()]);
      await navigateTo("/"); // Navigate to a blank or home page
      this.systemLogs = []; // Clear existing logs

      await new Promise(resolve => setTimeout(resolve, 2000));

      await Promise.all([this.addSystemLogs("powerup"), this.boot()]);
      await navigateTo("/login");
      this.resetBootingState();
    },

    // System Logs

    /**
     * Adds a series of system logs with randomized delays based on the boot type.
     * @param type - The type of boot action ("powerup" or "poweroff").
     */
    async addSystemLogs(type: "powerup" | "poweroff") {
      const totalTime = defaultBootDuration - 500;
      const logs = type === "powerup" ? powerUpSystemLogs : powerOffSystemLogs;

      const randomDelays = generateRandomDelays(logs.length, totalTime);

      for (let i = 0; i < logs.length; i++) {
        await this.addSystemLogWithDelay(logs[i]!, randomDelays[i]!); // Add non-null assertion since we know logs[i] exists
      }
    },

    /**
     * Adds a single system log after a specified delay.
     * @param log - The system log to add.
     * @param delay - The delay in milliseconds before adding the log.
     */
    addSystemLogWithDelay(log: SystemLog, delay: number) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.systemLogs.push(log);
          resolve();
        }, delay);
      });
    },
  },
});

interface BootStore {
  // Booting States
  isBooting: boolean;
  isPowerOffModalOpen: boolean;
  isRestartModalOpen: boolean;
  isLogoutModalOpen: boolean;
  systemLogs: SystemLog[];
}
