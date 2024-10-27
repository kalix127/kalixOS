<script lang="ts" setup></script>

<template>
  <div class="wrapper-login">
    <Topbar />
    <main>
      <slot />
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
