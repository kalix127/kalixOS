<script setup lang="ts">
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";
import { vOnClickOutside } from "@vueuse/components";

const globalStore = useGlobalStore();
const {
  isPowerOffMenuOpen,
  isWiredMenuOpen,
  isWifiMenuOpen,
  isBluetoothMenuOpen,
  isWiredEnabled,
  isWifiEnabled,
  isBluetoothEnabled,
} = storeToRefs(globalStore);

const { label } = defineProps<{
  label: "poweroff" | "wired" | "wifi" | "bluetooth";
}>();

const isOpen = computed(() => {
  switch (label) {
    case "poweroff":
      return isPowerOffMenuOpen.value;
    case "wired":
      return isWiredMenuOpen.value;
    case "wifi":
      return isWifiMenuOpen.value;
    case "bluetooth":
      return isBluetoothMenuOpen.value;
    default:
      return false;
  }
});

const isEnabled = computed(() => {
  switch (label) {
    case "wifi":
      return isWifiEnabled;
    case "wired":
      return isWiredEnabled;
    case "bluetooth":
      return isBluetoothEnabled;
    default:
      return false;
  }
});

function closeMenu() {
  isPowerOffMenuOpen.value = false;
  isWiredMenuOpen.value = false;
  isWifiMenuOpen.value = false;
  isBluetoothMenuOpen.value = false;
}
</script>

<template>
  <Collapsible :open="isOpen">
    <CollapsibleContent v-on-click-outside="closeMenu">
      <div class="select-none space-y-4 rounded-2xl bg-accent p-4 mt-4">
        <div class="flex items-center gap-4">
          <div
            class="grid place-content-center rounded-full p-2"
            :class="[isEnabled ? 'bg-primary' : 'bg-accent-light']"
          >
            <slot name="icon" />
          </div>
          <span class="text-xl font-bold">
            <slot name="title" />
          </span>
        </div>
        <div class="space-y-2">
          <slot name="content" />
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>

<style scoped></style>
