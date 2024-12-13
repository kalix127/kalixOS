<script setup lang="ts">
const props = defineProps<{
  name: string;
  type: string;
  placeholder: string;
  disabled?: boolean;
  inputClasses?: string;
  isLoading?: boolean;
}>();

const { name, placeholder, disabled, inputClasses, isLoading } = toRefs(props);

const initialType = ref(props.type);
const isPasswordVisible = ref(false);

const toggleVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const type = computed(() => {
  if (props.type === "password") {
    return isPasswordVisible.value ? "text" : "password";
  }
  return props.type;
});
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem class="space-y-4">
      <FormControl>
        <div class="relative flex items-center gap-4">
          <Input
            :class="inputClasses"
            :placeholder="placeholder"
            :type="type"
            :disabled="disabled"
            autocomplete="one-time-code"
            v-focus
            v-bind="componentField"
          />
          <template v-if="initialType === 'password'">
            <button
              type="button"
              aria-label="Toggle password visibility"
              class="absolute inset-y-0 end-0 flex items-center justify-center px-3"
              @click="toggleVisibility"
            >
              <Icon
                name="gnome:password-show-off"
                size="20"
                v-show="isPasswordVisible"
              />
              <Icon
                name="gnome:password-show-on"
                size="20"
                v-show="!isPasswordVisible"
              />
            </button>
          </template>
          <Icon
            v-if="isLoading"
            class="absolute -end-8"
            name="extra:loading-resize"
            size="20"
          />
        </div>
      </FormControl>
      <FormMessage class="absolute text-center text-sm text-foreground" />
    </FormItem>
  </FormField>
</template>

<style scoped></style>
