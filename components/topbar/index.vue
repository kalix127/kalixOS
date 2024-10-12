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
    class="flex items-center justify-between bg-[#080404] px-1"
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
      title="Power Off"
      description="The system will power off automatically in 60 seconds."
      :seconds="60"
      :isOpen="isPowerOffModalOpen"
      @closeModal="isPowerOffModalOpen = false"
      @action="handlePoweroff"
    />
    <TopbarPowerOffModal
      title="Restart"
      description="The system will restart automatically in 50 seconds."
      :seconds="50"
      :isOpen="isRestartModalOpen"
      @closeModal="isRestartModalOpen = false"
      @action="handleRestart"
    />
    <TopbarPowerOffModal
      :title="`Log Out ${username}`"
      :description="`${username} will be logged out automatically in 60 seconds.`"
      :seconds="60"
      :isOpen="isLogoutModalOpen"
      @closeModal="isLogoutModalOpen = false"
      @action="handleLogout"
    />
  </header>
</template>
