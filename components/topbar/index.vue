<script lang="ts" setup>
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";
const globalStore = useGlobalStore();

const { isPowerOffModalOpen, isRestartModalOpen, isLogoutModalOpen, username } =
  storeToRefs(globalStore);
const { handlePoweroff, handleRestart, handleLogout } = globalStore;

const route = useRoute();
</script>

<template>
  <header
    class="flex items-center justify-between bg-[#080404] p-1"
    :class="[route.name === 'login' ? '!bg-transparent' : '']"
  >
    <!-- Left empty div for spacing -->
    <div class="hidden sm:block sm:w-1/3"></div>

    <!-- Calendar -->
    <TopbarCalendar />

    <!-- Main menu -->
    <div class="flex w-1/3 items-center justify-end gap-2">
      <TopbarResources />
      <TopbarSystemMenu />
    </div>

    <!-- Power off modals -->
    <TopbarPowerOffModal
      :title="$t('power_off')"
      :label="$t('power_off')"
      :description="$t('power_off_modal', { seconds: 60 })"
      :seconds="60"
      :isOpen="isPowerOffModalOpen"
      @closeModal="isPowerOffModalOpen = false"
      @action="handlePoweroff"
    />
    <TopbarPowerOffModal
      :title="$t('restart')"
      :label="$t('restart')"
      :description="$t('restart_modal', { seconds: 50 })"
      :seconds="50"
      :isOpen="isRestartModalOpen"
      @closeModal="isRestartModalOpen = false"
      @action="handleRestart"
    />
    <TopbarPowerOffModal
      :title="`${$t('logout')} ${username}`"
      :label="$t('logout')"
      :description="$t('logout_modal', { username, seconds: 60 })"
      :seconds="60"
      :isOpen="isLogoutModalOpen"
      @closeModal="isLogoutModalOpen = false"
      @action="handleLogout"
    />
  </header>
</template>
