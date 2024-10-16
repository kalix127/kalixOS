<script setup lang="ts">
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();
const { isPowerOffMenuOpen } = storeToRefs(globalStore);

const { isOpen, seconds } = defineProps<{
  title: string;
  label: string;
  description: string;
  seconds: number;
  isOpen: boolean;
}>();

const emit = defineEmits(["closeModal", "action"]);

let timer: NodeJS.Timeout;

watchEffect(() => {
  if (isOpen) {
    // Close the poweroff menu when the modal is opened
    isPowerOffMenuOpen.value = false;

    timer = setTimeout(() => {
      emit("action");
    }, seconds * 1000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  } else {
    // Cleanup timer when modal is closed
    clearTimeout(timer);
  }
});
</script>

<template>
  <AlertDialog :open="isOpen">
    <AlertDialogContent
      class="max-w-[280px] rounded-xl p-0 xs:max-w-sm"
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
          >{{ $t("cancel") }}</Button
        >
        <Button
          variant="ghost"
          class="w-1/2 rounded-none rounded-br-xl bg-secondary"
          @click="() => emit('action')"
          >{{ label }}</Button
        >
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped></style>
