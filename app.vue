<script lang="js" setup>
import { Toaster } from "@/components/ui/sonner";
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";
const { isSuspended } = storeToRefs(useGlobalStore());
</script>

<template>
  <OverlaySuspended v-if="isSuspended" />
  <NuxtLayout v-else>
    <NuxtPage />
    <Toaster />
  </NuxtLayout>
</template>

<style>
.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.3s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
