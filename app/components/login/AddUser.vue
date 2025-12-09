<script setup lang="ts">
import type { AddUserForm } from "@/validations/auth.schema";
import { addUserSchema } from "@/validations/auth.schema";

const { isLoading, handleBack, loginView } = useAuth();
const { setUsername } = useGlobalStore();

async function onSubmit(values: AddUserForm) {
  setUsername(values.username);
  loginView.value = "enterPassword";
}
</script>

<template>
  <AuthForm
    :validation-schema="addUserSchema"
    :on-submit="onSubmit"
    :is-loading="isLoading"
    :show-back-button="true"
    @back="handleBack"
  >
    <template #fields>
      <AuthInput
        name="username"
        type="text"
        placeholder="Username"
        input-classes="h-9 bg-secondary pr-10"
        :disabled="isLoading"
      />
    </template>
  </AuthForm>
</template>

<style scoped></style>
