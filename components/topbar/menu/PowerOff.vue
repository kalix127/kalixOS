<script setup lang="ts">
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";
import { vOnClickOutside } from "@vueuse/components";

const globalStore = useGlobalStore();
const { isPowerOffMenuOpen, isAuthenticated } = storeToRefs(globalStore);

const { handleSuspend, handlePoweroff, handleRestart, handleLogout } =
  globalStore;

const options = [
  {
    name: "Suspend",
    handler: handleSuspend,
  },
  {
    name: "Restart...",
    handler: handleRestart,
  },
  {
    name: "Power Off...",
    handler: handlePoweroff,
  },
];

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
  </TopbarMenu>
</template>

<style scoped></style>
