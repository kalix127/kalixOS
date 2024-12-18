<script setup lang="ts">
import { type LoginForm, loginSchema } from "@/validations/auth.schema";

const { isLoading, handleLogin, handleBack } = useAuth();
const { username } = storeToRefs(useGlobalStore());
const { t } = useI18n();

async function onSubmit(values: LoginForm, setErrors: (errors: any) => void) {
  const success = await handleLogin(values.password);
  if (!success) {
    setErrors({
      password: t("zodI18n.errors.password_authentication_failed"),
    });
  }
}
</script>

<template>
  <AuthForm
    :validation-schema="loginSchema"
    :initial-values="{ password: 'password' }"
    :on-submit="onSubmit"
    :title="username"
    :show-back-button="true"
    :on-back="handleBack"
    :is-loading="isLoading"
  >
    <template #fields>
      <AuthInput
        name="password"
        type="password"
        placeholder="Password"
        aria-label="Password"
        default-value="password"
        input-classes="h-9 bg-secondary pr-10"
        :disabled="isLoading"
        :is-loading="isLoading"
      />
    </template>
  </AuthForm>
</template>

<style scoped></style>
