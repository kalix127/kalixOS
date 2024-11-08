<script setup lang="ts">
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "vue";
import { type WifiNetwork } from "@/types";

defineProps<{
  class?: HTMLAttributes["class"];
  network: WifiNetwork;
  size?: number;
}>();
</script>

<template>
  <Icon
    :name="`gnome:wifi-${network.signal}${network.isProtected ? '-lock' : ''}`"
    :class="cn('', $props.class)"
    :size="$props.size"
  />
</template>

<style scoped></style>
