<script lang="ts" setup>
definePageMeta({
  layout: "login",
  middleware: "desktop",
});

const globalStore = useGlobalStore();
const { loginView } = storeToRefs(globalStore);
</script>

<template>
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
