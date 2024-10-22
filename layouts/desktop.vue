<script setup lang="ts">
const globalStore = useGlobalStore();
const { isLocked } = storeToRefs(globalStore);
</script>

<template>
  <div class="wrapper-desktop relative">
    <Transition name="lock">
      <OverlayLock v-if="isLocked" />
    </Transition>
    <Topbar />
    <slot />
    <DesktopDock />
  </div>
</template>

<style>
.wrapper-desktop {
  min-height: 100vh;
  display: grid;
  grid-template-rows: 35px 1fr;
  grid-template-areas:
    "topbar"
    "main";
}

header {
  grid-area: topbar;
}

main {
  grid-area: main;
}

.lock-enter-active,
.lock-leave-active {
  transition: all 0.5s ease;
}

.lock-enter-from,
.lock-leave-to {
  transform: translateY(-100%);
}
</style>
