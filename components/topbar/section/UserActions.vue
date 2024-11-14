<script setup lang="ts">
const { t } = useI18n();

const globalStore = useGlobalStore();

const {
  isLanguageMenuOpen,
  isPowerOffMenuOpen,
  isAnyTopbarMenuOpen,
  isAuthenticated,
  isLocked,
} = storeToRefs(globalStore);

const { openApp } = useDesktopStore();

const { handleLock } = globalStore;

const items = [
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
</script>

<template>
  <div
    class="topbar-menu-transition flex justify-between gap-4"
    :class="[isAnyTopbarMenuOpen ? 'brightness-75' : '']"
  >
    <div class="flex items-center gap-2">
      <!-- Battery item -->
      <Button
        variant="ghost"
        class="flex cursor-default select-none items-center space-x-2 rounded-full bg-secondary p-2 px-3 duration-0 hover:bg-secondary-hover"
        :disabled="isAnyTopbarMenuOpen"
      >
        <Icon name="gnome:battery-full" size="18" />
        <span class="text-sm font-semibold">100%</span>
      </Button>
      <!-- Language Switcher -->
      <Button
        variant="ghost"
        size="icon"
        class="flex cursor-default select-none items-center space-x-2 rounded-full bg-secondary p-2 px-3 duration-0 hover:bg-secondary-hover"
        :disabled="isAnyTopbarMenuOpen"
        @click="isLanguageMenuOpen = !isLanguageMenuOpen"
      >
        <Icon name="gnome:languages" size="18" />
      </Button>
    </div>

    <!-- Lock, settings and poweroff buttons -->
    <div class="flex gap-4">
      <Button
        v-for="item in items"
        :key="item.name"
        :disabled="isAnyTopbarMenuOpen"
        size="icon"
        variant="ghost"
        class="cursor-default rounded-full bg-secondary duration-0 hover:bg-secondary-hover"
        @click="item.handler"
      >
        <Icon :name="item.icon" size="16" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
