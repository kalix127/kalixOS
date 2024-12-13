<script setup lang="ts">
import { useTimeoutFn } from "@vueuse/core";

const globalStore = useGlobalStore();
const { isPowerOffMenuOpen } = storeToRefs(globalStore);

const props = defineProps<{
  title: string;
  label: string;
  description: string;
  seconds: number;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "closeModal"): void;
  (e: "action"): void;
}>();

const timeoutCallback = () => {
  emit("action");
};

const { start, stop } = useTimeoutFn(
  timeoutCallback,
  () => props.seconds * 1000,
  { immediate: false },
);

/**
 * - When opened, it starts the countdown and ensures the power-off menu is closed.
 * - When closed, it stops any ongoing countdown.
 */
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      // Close the power-off menu when the modal is opened
      isPowerOffMenuOpen.value = false;

      // Start the countdown
      start();
    } else {
      // Stop the countdown if the modal is closed
      stop();
    }
  },
);

onBeforeUnmount(() => {
  stop();
});
</script>

<template>
  <AlertDialog :open="isOpen">
    <AlertDialogContent
      class="z-[60000] max-w-[280px] rounded-xl p-0 shadow-lg xs:max-w-sm"
    >
      <AlertDialogHeader class="sr-only">
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div class="flex flex-col items-center gap-4 p-4 pt-6 text-center">
        <h1 class="text-xl font-extrabold">{{ title }}</h1>
        <p class="text-sm">{{ description }}</p>
      </div>

      <div class="flex w-full gap-[1px]">
        <Button
          variant="ghost"
          class="w-1/2 rounded-none rounded-bl-xl border-2 border-primary/60 bg-secondary"
          @click="() => emit('closeModal')"
        >
          {{ $t("cancel") }}
        </Button>
        <Button
          variant="ghost"
          class="w-1/2 rounded-none rounded-br-xl bg-secondary"
          @click="() => emit('action')"
        >
          {{ label }}
        </Button>
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped></style>
