<script setup lang="ts">
const globalStore = useGlobalStore();
const { isLocked, isAboutToSuspend, isSuspended } = storeToRefs(globalStore);

const { backgroundImage } = storeToRefs(useDesktopStore());
</script>

<template>
  <div class="wrapper-desktop relative">
    <OverlaySuspended v-if="isAboutToSuspend || isSuspended" />

    <Transition name="lock">
      <OverlayLock v-if="isLocked" />
    </Transition>
    <div class="relative max-h-[100svh] max-w-[100svw]">
      <Topbar class="absolute left-0 top-0 w-full" />
      <!-- Background image -->
      <Transition name="background">
        <NuxtImg
          :alt="backgroundImage.name"
          :key="backgroundImage.name"
          :src="backgroundImage.url"
          class="absolute -z-[1] h-full w-full object-cover"
          style="-webkit-user-drag: none"
        />
      </Transition>
      <slot />
    </div>
    <ClientOnly>
      <!-- Context menu -->
      <DesktopContextMenu />

      <!-- Dockbar -->
      <DesktopDock v-if="!isLocked" />
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

.background-enter-active,
.background-leave-active {
  transition: all 0.2s ease;
}

.background-enter-from,
.background-leave-to {
  opacity: 0;
}
</style>
