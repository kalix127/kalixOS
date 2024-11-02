<script setup lang="ts">
import { useForm } from "vee-validate";
import { loginSchema, type LoginForm } from "@/validations/auth.schema";
import { toTypedSchema } from "@vee-validate/zod";

const { t } = useI18n();
const globalStore = useGlobalStore();
const { username, isLocked } = storeToRefs(globalStore);

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
    isLocked.value = false;
  } else {
    setErrors({
      password: t("zodI18n.errors.password_authentication_failed"),
    });
  }

  isLoading.value = false;
});
</script>

<template>
  <div
    @contextmenu.prevent=""
    class="absolute z-[100000] h-[100svh] w-[100vw] bg-black"
  >
    <!-- Background -->
    <NuxtImg
      src="/img/bg-desktop.jpg"
      class="h-[100svh] w-[100vw] select-none object-cover blur-2xl"
      style="-webkit-user-drag: none"
    />

    <!-- Login Form -->
    <div
      class="absolute left-1/2 top-1/2 flex w-72 max-w-screen-xs -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6"
    >
    <div class="grid place-content-center rounded-full bg-secondary p-6">
      <Icon name="gnome:avatar" size="120" />
    </div>

      <h1 class="text-2xl font-extrabold">{{ username }}</h1>

      <!-- Password Input -->
      <form @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="password">
          <FormItem class="space-y-4">
            <FormControl>
              <div class="relative flex items-center gap-4">
                <Input
                  class="h-9 border-2 border-accent-hover bg-secondary/70 pr-10 focus:!ring-0"
                  aria-label="Password"
                  placeholder="Password"
                  autofocus
                  autocomplete
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
                  <Icon
                    name="gnome:password-show-off"
                    size="20"
                    v-show="!isPasswordVisible"
                  />
                  <Icon
                    name="gnome:password-show-on"
                    size="20"
                    v-show="isPasswordVisible"
                  />
                </button>

                <!-- Loading Icon -->
                <Icon
                  class="absolute -end-10 hidden xs:block"
                  v-show="isLoading"
                  name="extra:loading-resize"
                  size="20"
                />
              </div>
            </FormControl>
            <FormMessage class="text-center text-sm text-foreground" />
          </FormItem>
        </FormField>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
