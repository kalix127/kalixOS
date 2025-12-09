<script setup lang="ts">
import type { LoginForm } from "@/validations/auth.schema";
import { loginSchema } from "@/validations/auth.schema";

const { isLoading, handleUnlock } = useAuth();
const { username } = storeToRefs(useGlobalStore());
const { t } = useI18n();

async function onSubmit(values: LoginForm, setErrors: (errors: any) => void) {
  const success = await handleUnlock(values.password);
  if (!success) {
    setErrors({
      password: t("zodI18n.errors.password_authentication_failed"),
    });
  }
}
</script>

<template>
  <div
    class="absolute z-[90000] h-svh w-svw backdrop-blur-xl"
    @contextmenu.prevent=""
  >
    <!-- Login Form -->
    <div
      class="absolute left-1/2 top-1/2 max-w-screen-xs -translate-x-1/2 -translate-y-1/2"
    >
      <AuthForm
        :validation-schema="loginSchema"
        :initial-values="{ password: 'password' }"
        :on-submit="onSubmit"
        :title="username"
        :show-back-button="false"
        :is-loading="isLoading"
      >
        <template #fields>
          <AuthInput
            name="password"
            type="password"
            placeholder="Password"
            aria-label="Password"
            default-value="password"
            input-classes="h-9 border-2 border-accent-hover bg-secondary/70 pr-10 focus:!ring-0"
            :disabled="isLoading"
            :is-loading="isLoading"
          />
        </template>
      </AuthForm>
    </div>
  </div>
</template>

<style scoped></style>
