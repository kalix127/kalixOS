<script lang="ts" setup>
definePageMeta({
  layout: "login",
  middleware: "desktop",
});

const { t } = useI18n();
useHead({
  title: computed(() => t("seo.title.login")),
  meta: [{ name: "description", content: t("seo.description.login") }],
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
      <LazyLoginAddUser v-else-if="loginView === 'addUser'" />

      <!-- Form -->
      <LazyLoginForm v-else-if="loginView === 'enterPassword'" />
    </Transition>

    <!-- Welcome -->
    <LoginWelcome />
  </div>
</template>

<style scoped></style>
