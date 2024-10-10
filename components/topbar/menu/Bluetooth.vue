<script setup lang="ts">
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";
import { vOnClickOutside } from "@vueuse/components";

const globalStore = useGlobalStore();
const { isBluetoothMenuOpen } = storeToRefs(globalStore);

function closeMenu() {
  isBluetoothMenuOpen.value = false;
}
</script>

<template>
  <TopbarMenu
    v-on-click-outside="closeMenu"
    title="Bluetooth"
    icon="material-symbols:bluetooth"
    label="bluetooth"
  >
    <div
      class="grid place-content-center p-6 text-center text-lg font-extrabold text-muted-foreground/70"
    >
      No available or <br />
      connected device
    </div>
  </TopbarMenu>
</template>

<style scoped></style>
