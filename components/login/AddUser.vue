<script setup lang="ts">
import { useForm } from "vee-validate";
import { addUserSchema, type AddUserForm } from "~/validations/auth.schema";
import { toTypedSchema } from "@vee-validate/zod";

const globalStore = useGlobalStore();
const { loginView, username } = storeToRefs(globalStore);

function handleBack() {
  loginView.value = "selectUser";
}

const isLoading = ref(false);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(addUserSchema),
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

    <!-- Username Input -->
    <form @submit.prevent="onSubmit">
      <FormField v-slot="{ componentField }" name="username">
        <FormItem class="space-y-4">
          <FormControl>
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
              <Input
                class="h-9 bg-secondary pr-10"
                aria-label="Username"
                placeholder="Username"
                autofocus
                v-bind="componentField"
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
