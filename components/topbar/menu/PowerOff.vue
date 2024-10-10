<script setup lang="ts">
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";
import { vOnClickOutside } from "@vueuse/components";

const globalStore = useGlobalStore();
const { isPowerOffMenuOpen } = storeToRefs(globalStore);

const options = [
  {
    name: "Suspend",
    handler: () => {
      console.log("Suspend");
    },
  },
  {
    name: "Restart...",
    handler: () => {
      console.log("Restart");
    },
  },
  {
    name: "Power off...",
    handler: () => {
      console.log("Power off");
    },
  },
  // TODO: Add logout option
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
    <!-- TODO: Maybe add spacing between the last button and its border top -->
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
