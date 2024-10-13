<script setup lang="ts">
import { useGlobalStore } from "~/stores/global.store";

const globalStore = useGlobalStore();

const { isLocked } = storeToRefs(globalStore);
</script>

<template>
  <div>
    <Transition name="lock">
      <OverlayLock v-if="isLocked" />
    </Transition>
    <Topbar />
    <slot />
  </div>
</template>

<style scoped>
.lock-enter-active,
.lock-leave-active {
  transition: all 0.5s ease;
}

.lock-enter-from,
.lock-leave-to {
  transform: translateY(-100%);
}
</style>
