<script setup lang="ts">
import { useGlobalStore } from "~/stores/global.store";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();

const { isPowerOffMenuOpen, isAnyTopbarMenuOpen } = storeToRefs(globalStore);

const items = [
  {
    name: "Settings",
    icon: "material-symbols:settings-rounded",
    handler: () => {
      console.log("Settings");
    },
  },
  {
    name: "Lock",
    icon: "material-symbols:lock",
    handler: () => {
      console.log("Lock");
    },
  },
  {
    name: "Poweroff",
    icon: "fa6-solid:power-off",
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
    <!-- Battery item -->
    <Button
      variant="ghost"
      class="flex cursor-default select-none items-center space-x-2 rounded-full bg-secondary p-2 px-3"
      :disabled="isAnyTopbarMenuOpen"
    >
      <Icon name="mdi:battery-charging" size="20" />
      <span class="text-sm font-semibold">100%</span>
    </Button>

    <!-- Lock, settings and poweroff buttons -->
    <div class="flex gap-4">
      <Button
        v-for="item in items"
        :key="item.name"
        :disabled="isAnyTopbarMenuOpen"
        size="icon"
        variant="ghost"
        class="cursor-default rounded-full bg-secondary"
        @click="item.handler"
      >
        <Icon :name="item.icon" size="17" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
