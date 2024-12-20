<script setup lang="ts">
const globalStore = useGlobalStore();
const { isLocked, isAboutToSuspend, isSuspended } = storeToRefs(globalStore);

const { backgroundImage, isShowAppsOverlayVisible }
  = storeToRefs(useDesktopStore());

const { renamePopoverPosition } = storeToRefs(useContextMenuStore());
</script>

<template>
  <div class="wrapper-desktop relative">
    <!-- Overlays -->
    <LazyOverlaySuspended v-if="isAboutToSuspend || isSuspended" />

    <Transition name="lock">
      <LazyOverlayLock v-if="isLocked" />
    </Transition>

    <Transition>
      <LazyOverlayAppsList v-if="isShowAppsOverlayVisible" />
    </Transition>

    <DesktopProjectInfo />

    <!-- Desktop -->
    <div class="relative max-h-svh max-w-[100svw]">
      <Topbar class="absolute left-0 top-0 w-full" />
      <!-- Background image -->
      <Transition name="background">
        <NuxtImg
          :key="backgroundImage.name"
          :alt="backgroundImage.name"
          :src="backgroundImage.url"
          class="absolute size-full object-cover"
          sizes="sm:1000px md:1200px lg:1400px xl:1800px"
          style="-webkit-user-drag: none"
          format="webp"
        />
      </Transition>
      <slot />
    </div>
    <ClientOnly>
      <!-- Context menu -->
      <LazyDesktopContextMenu />

      <!-- Dockbar -->
      <DesktopDock v-if="!isLocked" />

      <!-- Rename popover -->
      <Transition>
        <DesktopNodeRenamePopover v-if="renamePopoverPosition && renamePopoverPosition?.node?.isRenaming" />
      </Transition>
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
