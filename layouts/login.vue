<script lang="ts" setup>
const { isAboutToSuspend, isSuspended } = storeToRefs(useGlobalStore());
</script>

<template>
  <div class="wrapper-login">
    <OverlaySuspended v-if="isAboutToSuspend || isSuspended" />
    <Topbar />
    <main class="grid h-full grid-rows-[1fr_75px]">
      <slot />
      <LoginFooter />
    </main>
  </div>
</template>

<style scoped>
.wrapper-login {
  min-height: 100svh;
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
</style>
