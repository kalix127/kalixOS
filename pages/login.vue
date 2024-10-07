<script lang="ts" setup>
import { useForm } from "vee-validate";
import { loginValidationSchema } from "@/validations/auth";
import type { LoginForm } from "@/types";
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";
import { toast } from "vue-sonner";

definePageMeta({
  layout: "login",
});

// TODO: Implement the easter egg
function handleNotListed() {
  toast.error("Not implemented", {
    duration: 10000,
  });
}

const globalStore = useGlobalStore();
const { isAuthenticated } = storeToRefs(globalStore);

const isAuthenticating = ref(false);
const isLoading = ref(false);
const isPasswordVisible = ref(false);

const { handleSubmit, setErrors } = useForm({
  validationSchema: loginValidationSchema,
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
    await navigateTo("/");
  } else {
    setErrors({
      password: "Incorrect password",
    });
  }

  isLoading.value = false;
});
</script>

<template>
  <div class="grid h-full grid-rows-[90%_10%]">
    <div class="grid place-content-center">
      <Transition mode="out-in">
        <!-- Login Home / Users list -->
        <div class="flex flex-col gap-2" v-if="!isAuthenticating">
          <button @click="isAuthenticating = true">
            <div
              class="flex min-h-14 min-w-72 cursor-pointer items-center gap-2 rounded-xl bg-secondary p-1.5 hover:ring-2 hover:ring-primary"
            >
              <div class="grid place-content-center rounded-full bg-accent p-2">
                <Icon name="material-symbols:person" size="28" />
              </div>
              <span class="font-bold"> Gianluca </span>
            </div>
          </button>
          <Button
            @click="handleNotListed"
            variant="ghost"
            size="xs"
            class="w-fit rounded-md p-2 hover:bg-secondary"
          >
            <p class="select-none text-sm font-semibold">Not listed?</p>
          </Button>
        </div>

        <!-- Login Form -->
        <div v-else>
          <div class="flex w-72 max-w-screen-xs flex-col items-center gap-6">
            <div class="grid place-content-center rounded-full bg-accent p-2">
              <Icon name="material-symbols:person" size="140" />
            </div>

            <h1 class="text-2xl font-bold">Gianluca</h1>

            <div class="flex items-center gap-4">
              <!-- Back button -->
              <Button
                variant="ghost"
                size="icon"
                class="grid h-9 w-9 cursor-pointer place-content-center rounded-full bg-secondary p-2"
                type="button"
                :disabled="isLoading"
                @click="isAuthenticating = false"
              >
                <Icon name="ion:md-arrow-round-back" size="18" />
              </Button>

              <!-- Password Input -->
              <form @submit.prevent="onSubmit">
                <FormField v-slot="{ componentField }" name="password">
                  <FormItem>
                    <FormControl>
                      <div class="relative flex items-center gap-1.5">
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
                          <Icon
                            name="mdi:eye"
                            size="20"
                            v-show="!isPasswordVisible"
                          />
                          <Icon
                            name="mdi:eye-off"
                            size="20"
                            v-show="isPasswordVisible"
                          />
                        </button>
                        <!-- Loading Icon -->
                        <Icon
                          class="absolute -end-10 hidden xs:block"
                          v-show="isLoading"
                          name="svg-spinners:ring-resize"
                          size="24"
                        />
                      </div>
                    </FormControl>
                    <FormMessage class="absolute text-sm text-red-500" />
                  </FormItem>
                </FormField>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Bottom logo -->
    <div class="grid place-content-center">
      <ManjaroFullLogo class="max-w-48" />
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
