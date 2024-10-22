<script lang="ts" setup>
definePageMeta({
  layout: "login",
});

const globalStore = useGlobalStore();
const { loginView } = storeToRefs(globalStore);
</script>

<template>
  <div class="grid h-full grid-rows-[1fr_100px]">
    <div class="grid place-content-center">
      <Transition mode="out-in">
        <!-- Select User -->
        <LoginSelectUser v-if="loginView === 'selectUser'" />

        <!-- Add user -->
        <LoginAddUser v-else-if="loginView === 'addUser'" />

        <!-- Form -->
        <LoginForm v-else-if="loginView === 'enterPassword'" />
      </Transition>
    </div>

    <!-- Bottom logo -->
    <div class="grid place-content-center">
      <LogoManjaroFull class="max-w-48" />
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
