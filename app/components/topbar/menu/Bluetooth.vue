<script setup lang="ts">
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
    :is-open="isBluetoothMenuOpen"
    :is-enabled="isBluetoothEnabled"
    :title="$t('bluetooth')"
    icon="gnome:bluetooth-on"
  >
    <div
      class="text-md grid place-content-center p-6 text-center font-bold text-muted-foreground/70 sm:text-lg"
    >
      {{
        isBluetoothEnabled
          ? $t("bluetooth_enabled_description")
          : $t("bluetooth_disabled_description")
      }}
    </div>
  </TopbarMenu>
</template>

<style scoped></style>
