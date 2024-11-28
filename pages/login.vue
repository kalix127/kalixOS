<script lang="ts" setup>
definePageMeta({
  layout: "login",
  middleware: "desktop",
});

const globalStore = useGlobalStore();
const { loginView } = storeToRefs(globalStore);

onBeforeMount(() => {
  loginView.value = "selectUser";
});
</script>

<template>
  <div class="order-1 grid place-content-center">
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

<style scoped></style>
