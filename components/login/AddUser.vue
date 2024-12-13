<script setup lang="ts">
import { addUserSchema, type AddUserForm } from "@/validations/auth.schema";

const { isLoading, handleBack, loginView } = useAuth();
const { setUsername } = useGlobalStore();

const onSubmit = async (
  values: AddUserForm,
  setErrors: (errors: any) => void,
) => {
  setUsername(values.username);
  loginView.value = "enterPassword";
};
</script>

<template>
  <AuthForm
    :validationSchema="addUserSchema"
    :onSubmit="onSubmit"
    :isLoading="isLoading"
    :showBackButton="true"
    @back="handleBack"
  >
    <template #fields>
      <AuthInput
        name="username"
        type="text"
        placeholder="Username"
        inputClasses="h-9 bg-secondary pr-10"
        :disabled="isLoading"
      />
    </template>
  </AuthForm>
</template>

<style scoped></style>
