<script setup lang="ts">
import { useForm } from "vee-validate";
import { loginSchema, type LoginForm } from "~/validations/auth.schema";
import { toTypedSchema } from "@vee-validate/zod";

const { t } = useI18n();

const globalStore = useGlobalStore();
const { isAuthenticated, loginView, username } = storeToRefs(globalStore);

function handleBack() {
  loginView.value = "selectUser";
}

const isLoading = ref(false);
const isPasswordVisible = ref(false);

const { handleSubmit, setErrors } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    password: "password",
  },
});

const onSubmit = handleSubmit(async (values: LoginForm) => {
  isLoading.value = true;

  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if the password is correct
  if (values.password === "password") {
    isAuthenticated.value = true;

    // Persist the login
    const cookie = useCookie<boolean>("isAuthenticated", {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    cookie.value = true;

    await navigateTo("/desktop");
  } else {
    setErrors({
      password: t("zodI18n.errors.password_authentication_failed"),
    });
  }

  isLoading.value = false;
});
</script>

<template>
  <div class="flex w-72 max-w-screen-xs flex-col items-center gap-6">
    <div class="grid place-content-center rounded-full bg-secondary p-2">
      <Icon name="material-symbols:person" size="140" />
    </div>

    <h1 class="text-2xl font-extrabold">{{ username }}</h1>

    <!-- Password Input -->
    <form @submit.prevent="onSubmit">
      <FormField v-slot="{ componentField }" name="password">
        <FormItem class="space-y-4">
          <FormControl>
            <div class="relative flex items-center gap-4">
              <!-- Back button -->
              <Button
                variant="ghost"
                size="icon"
                class="grid h-9 w-9 cursor-pointer place-content-center rounded-full bg-secondary p-2"
                type="button"
                :disabled="isLoading"
                @click="handleBack"
              >
                <Icon name="ion:md-arrow-round-back" size="18" />
              </Button>

              <Input
                class="h-9 bg-secondary pr-10"
                aria-label="Password"
                placeholder="Password"
                autofocus
                v-bind="componentField"
                :type="isPasswordVisible ? 'text' : 'password'"
                :disabled="isLoading"
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                class="absolute inset-y-0 end-0 flex items-center justify-center px-3"
                @click="isPasswordVisible = !isPasswordVisible"
              >
                <Icon name="mdi:eye" size="20" v-show="!isPasswordVisible" />
                <Icon name="mdi:eye-off" size="20" v-show="isPasswordVisible" />
              </button>

              <!-- Loading Icon -->
              <Icon
                class="absolute -end-10 hidden xs:block"
                v-show="isLoading"
                name="svg-spinners:ring-resize"
                size="20"
              />
            </div>
          </FormControl>
          <FormMessage class="text-center text-sm text-foreground" />
        </FormItem>
      </FormField>
    </form>
  </div>
</template>

<style scoped></style>
