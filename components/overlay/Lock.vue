<script setup lang="ts">
import { loginSchema, type LoginForm } from "@/validations/auth.schema";

const { isLoading, handleUnlock } = useAuth();
const { username } = storeToRefs(useGlobalStore());
const { t } = useI18n();

const onSubmit = async (
  values: LoginForm,
  setErrors: (errors: any) => void,
) => {
  const success = await handleUnlock(values.password);
  if (!success) {
    setErrors({
      password: t("zodI18n.errors.password_authentication_failed"),
    });
  }
};
</script>

<template>
  <div
    @contextmenu.prevent=""
    class="absolute z-[90000] h-[100svh] w-[100svw] backdrop-blur-xl"
  >
    <!-- Login Form -->
    <div
      class="absolute left-1/2 top-1/2 max-w-screen-xs -translate-x-1/2 -translate-y-1/2"
    >
      <AuthForm
        :validationSchema="loginSchema"
        :initialValues="{ password: 'password' }"
        :onSubmit="onSubmit"
        :title="username"
        :showBackButton="false"
        :isLoading="isLoading"
      >
        <template #fields>
          <AuthInput
            name="password"
            type="password"
            placeholder="Password"
            ariaLabel="Password"
            defaultValue="password"
            inputClasses="h-9 border-2 border-accent-hover bg-secondary/70 pr-10 focus:!ring-0"
            :disabled="isLoading"
            :isLoading="isLoading"
          />
        </template>
      </AuthForm>
    </div>
  </div>
</template>

<style scoped></style>
