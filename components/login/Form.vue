<script setup lang="ts">
import { loginSchema, type LoginForm } from "~/validations/auth.schema";

const { isLoading, handleLogin, handleBack } = useAuth();
const { username } = storeToRefs(useGlobalStore());
const { t } = useI18n();

const onSubmit = async (
  values: LoginForm,
  setErrors: (errors: any) => void,
) => {
  const success = await handleLogin(values.password);
  if (!success) {
    setErrors({
      password: t("zodI18n.errors.password_authentication_failed"),
    });
  }
};
</script>

<template>
  <AuthForm
    :validationSchema="loginSchema"
    :initialValues="{ password: 'password' }"
    :onSubmit="onSubmit"
    :title="username"
    :showBackButton="true"
    :onBack="handleBack"
    :isLoading="isLoading"
  >
    <template #fields>
      <AuthInput
        name="password"
        type="password"
        placeholder="Password"
        ariaLabel="Password"
        defaultValue="password"
        inputClasses="h-9 bg-secondary pr-10"
        :disabled="isLoading"
      />
    </template>
  </AuthForm>
</template>

<style scoped></style>
