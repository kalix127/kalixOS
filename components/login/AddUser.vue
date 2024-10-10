<script setup lang="ts">
import { useForm } from "vee-validate";
import { addUserValidationSchema } from "@/validations/auth";
import type { AddUserForm } from "@/types";
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();
const { loginView, username } = storeToRefs(globalStore);

function handleBack() {
  loginView.value = "selectUser";
}

const isLoading = ref(false);

const { handleSubmit } = useForm({
  validationSchema: addUserValidationSchema,
});

const onSubmit = handleSubmit(async (values: AddUserForm) => {
  username.value = values.username;
  loginView.value = "enterPassword";
});
</script>

<template>
  <div class="flex w-72 max-w-screen-xs flex-col items-center gap-16">
    <div class="grid place-content-center rounded-full bg-secondary p-2">
      <Icon name="material-symbols:person" size="140" />
    </div>

    <div class="flex items-center gap-4">
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

      <!-- Username Input -->
      <form @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormControl>
              <Input
                class="h-9 bg-secondary pr-10"
                aria-label="Username"
                placeholder="Username"
                autofocus
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage class="absolute text-sm text-red-500" />
          </FormItem>
        </FormField>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
