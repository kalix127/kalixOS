<script setup lang="ts">
const { t } = useI18n();

const globalStore = useGlobalStore();

const {
  isLanguageMenuOpen,
  isPowerOffMenuOpen,
  isAnyTopbarMenuOpen,
  isAuthenticated,
  isLocked,
  currentSettingsTab,
} = storeToRefs(globalStore);

const desktopStore = useDesktopStore();
const { hasAppsLoading } = storeToRefs(desktopStore);
const { openApp } = desktopStore;

const { handleLock } = globalStore;

const items = [
  {
    name: t("language.switch"),
    icon: "gnome:languages",
    handler: () => {
      isLanguageMenuOpen.value = !isLanguageMenuOpen.value;
    },
  },

  // If authenticated and not locked, show the settings and lock buttons
  ...(isAuthenticated.value && !isLocked.value
    ? [
        {
          name: t("settings"),
          icon: "gnome:settings",
          handler: () => {
            openApp("settings");
          },
        },
        {
          name: t("lock"),
          icon: "gnome:lock",
          handler: handleLock,
        },
      ]
    : []),
  {
    name: t("power_off"),
    icon: "gnome:poweroff",
    handler: () => {
      isPowerOffMenuOpen.value = !isPowerOffMenuOpen.value;
    },
  },
];

function handleBatteryMenu() {
  currentSettingsTab.value = "power";
  openApp("settings");
}
</script>

<template>
  <div
    class="topbar-menu-transition flex justify-between gap-4"
    :class="[isAnyTopbarMenuOpen ? 'brightness-75' : '']"
  >
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Battery item -->
      <Button
        variant="ghost"
        class="flex size-fit select-none items-center space-x-2 rounded-full bg-secondary p-2 duration-0 hover:bg-secondary-hover sm:p-3"
        :class="[hasAppsLoading ? 'cursor-progress' : '']"
        :disabled="isAnyTopbarMenuOpen"
        @click="handleBatteryMenu"
      >
        <Icon name="gnome:battery-full" class="size-[14px] sm:size-4" />
        <span class="text-xs font-semibold sm:text-sm">100%</span>
      </Button>
    </div>

    <!-- Lock, settings and poweroff buttons -->
    <div class="flex items-center gap-2 sm:gap-4">
      <Button
        v-for="item in items"
        :key="item.name"
        :disabled="isAnyTopbarMenuOpen"
        size="icon"
        variant="ghost"
        class="size-fit rounded-full bg-secondary p-2.5 duration-0 hover:bg-secondary-hover sm:p-3"
        :class="[hasAppsLoading ? 'cursor-progress' : '']"
        @click="item.handler"
      >
        <Icon :name="item.icon" class="size-[14px] sm:size-4" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
