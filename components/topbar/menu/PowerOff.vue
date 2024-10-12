<script setup lang="ts">
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";
import { vOnClickOutside } from "@vueuse/components";

const globalStore = useGlobalStore();
const {
  isPowerOffMenuOpen,
  isRestartModalOpen,
  isPowerOffModalOpen,
  isLogoutModalOpen,
  isAuthenticated,
} = storeToRefs(globalStore);

const { handleSuspend } = globalStore;

const options = [
  {
    name: "Suspend",
    handler: handleSuspend,
  },
  {
    name: "Restart...",
    handler: () => {
      isRestartModalOpen.value = true;
    },
  },
  {
    name: "Power Off...",
    handler: () => {
      isPowerOffModalOpen.value = true;
    },
  },
];

function handleLogout() {
  isLogoutModalOpen.value = true;
}

function closeMenu() {
  isPowerOffMenuOpen.value = false;
}
</script>

<template>
  <TopbarMenu
    v-on-click-outside="closeMenu"
    title="Power Off"
    icon="fa6-solid:power-off"
    label="poweroff"
  >
    <Button
      v-for="option in options"
      :key="option.name"
      @click="option.handler"
      variant="ghost"
      class="w-full cursor-default justify-start rounded-xl font-medium duration-0 hover:bg-accent"
      >{{ option.name }}</Button
    >
    <template v-if="isAuthenticated">
      <!-- Separator -->
      <div class="h-1 border-t border-gray-500/40 px-2"></div>
      <Button
        @click="handleLogout"
        variant="ghost"
        class="w-full cursor-default justify-start rounded-xl font-medium duration-0 hover:bg-accent"
        >Log Out...
      </Button>
    </template>
  </TopbarMenu>
</template>

<style scoped></style>
