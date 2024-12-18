<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

const props = defineProps<{
  validationSchema: any;
  initialValues?: Record<string, any>;
  onSubmit: (values: any, setErrors: (errors: any) => void) => Promise<void>;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  isLoading?: boolean;
}>();

const { title, isLoading } = toRefs(props);

const { handleSubmit, setErrors } = useForm({
  validationSchema: toTypedSchema(props.validationSchema),
  initialValues: props.initialValues || {},
});

const submitHandler = handleSubmit(values =>
  props.onSubmit(values, setErrors),
);
</script>

<template>
  <div class="flex w-72 max-w-screen-xs flex-col items-center gap-8">
    <div class="grid place-content-center rounded-full bg-secondary p-6">
      <Icon
        name="gnome:avatar"
        size="110"
      />
    </div>

    <h1 v-if="title" class="text-2xl font-bold">{{ title }}</h1>

    <form @submit.prevent="submitHandler">
      <div class="relative flex items-center gap-4">
        <Button
          v-if="showBackButton"
          variant="ghost"
          size="icon"
          class="grid h-9 w-9 cursor-pointer place-content-center rounded-full bg-secondary p-2"
          type="button"
          :disabled="isLoading"
          @click="onBack"
        >
          <Icon
            name="gnome:arrow-long-left"
            size="18"
          />
        </Button>
        <slot name="fields" />
      </div>
    </form>
  </div>
</template>

<style scoped></style>
