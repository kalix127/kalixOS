<script setup lang="ts">
import { type WifiNetwork } from "@/types";

const props = defineProps<{
  network: WifiNetwork | null;
  size?: number;
}>();

const { network } = toRefs(props);

const wifiIcon = computed(() => {
  if (!network.value) {
    return "gnome:wifi-not-connected";
  }
  return `gnome:wifi-${network.value.signal}${network.value.isProtected ? "-lock" : ""}`;
});
</script>

<template>
  <Icon :name="wifiIcon" :size="$props.size" />
</template>

<style scoped></style>
