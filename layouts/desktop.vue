<script setup lang="ts">
const globalStore = useGlobalStore();
const { isLocked } = storeToRefs(globalStore);
</script>

<template>
  <div class="wrapper-desktop relative">
    <Transition name="lock">
      <OverlayLock v-if="isLocked" />
    </Transition>
    <div class="relative">
      <Topbar class="absolute top-0 left-0 w-full" />
      <!-- Background image -->
      <NuxtImg
        src="/img/bg-desktop.jpg"
        class="absolute -z-[1] h-full w-full object-cover"
        style="-webkit-user-drag: none"
      />
      <slot />
    </div>
    <ClientOnly>
      <!-- Context menu -->
      <DesktopContextMenu />

      <!-- Dockbar -->
      <DesktopDock />
    </ClientOnly>
  </div>
</template>

<style>
.wrapper-desktop {
  height: 100svh;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-areas: "main";
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
