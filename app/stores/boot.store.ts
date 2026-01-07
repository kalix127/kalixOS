import type { SystemLog } from "@/types";
import {
  defaultBootDuration,
  powerOffSystemLogs,
  powerUpSystemLogs,
} from "@/constants";
import { generateRandomDelays } from "@/helpers";

export const useBootStore = defineStore("bootStore", {
  state: (): BootStore => ({
    isBooting: false,
    isPowerOffModalOpen: false,
    isRestartModalOpen: false,
    isLogoutModalOpen: false,
    systemLogs: [],
  }),
  actions: {
    resetBootingState() {
      this.isBooting = false;
      this.systemLogs = [];
    },

    async boot() {
      this.isBooting = true;

      const { setIsAuthenticated } = useGlobalStore();
      setIsAuthenticated(false);

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
      await navigateTo("/");
      this.systemLogs = [];

      await new Promise(resolve => setTimeout(resolve, 2000));

      await Promise.all([this.addSystemLogs("powerup"), this.boot()]);
      await navigateTo("/login");
      this.resetBootingState();
    },

    async addSystemLogs(type: "powerup" | "poweroff") {
      const totalTime = defaultBootDuration - 500;
      const logs = type === "powerup" ? powerUpSystemLogs : powerOffSystemLogs;

      const randomDelays = generateRandomDelays(logs.length, totalTime);

      for (const [index, log] of logs.entries()) {
        await this.addSystemLogWithDelay(log, randomDelays[index] ?? 0);
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
});

interface BootStore {
  isBooting: boolean;
  isPowerOffModalOpen: boolean;
  isRestartModalOpen: boolean;
  isLogoutModalOpen: boolean;
  systemLogs: SystemLog[];
}
