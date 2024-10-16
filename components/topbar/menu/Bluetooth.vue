<script setup lang="ts">
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";
import { vOnClickOutside } from "@vueuse/components";

const globalStore = useGlobalStore();
const { isBluetoothMenuOpen, isBluetoothEnabled } = storeToRefs(globalStore);

function closeMenu() {
  isBluetoothMenuOpen.value = false;
}
</script>

<template>
  <TopbarMenu
    v-on-click-outside="closeMenu"
    :isOpen="isBluetoothMenuOpen"
    :isEnabled="isBluetoothEnabled"
    :title="$t('bluetooth')"
    icon="material-symbols:bluetooth"
  >
    <div
      class="grid place-content-center p-6 text-center text-lg font-extrabold text-muted-foreground/70"
    >
      {{ $t("bluetooth_not_available") }}
    </div>
  </TopbarMenu>
</template>

<style scoped></style>
