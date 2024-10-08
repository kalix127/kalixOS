<script setup lang="ts">
import { type Ref, ref } from "vue";
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { Calendar } from "@/components/ui/calendar";

const currentDate = ref(new Date());

onMounted(() => {
  const intervalId = setInterval(() => {
    currentDate.value = new Date();
  }, 100);

  onUnmounted(() => {
    clearInterval(intervalId);
  });
});

// Computed property to format the date
const formattedDate = computed(() => {
  return Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(currentDate.value);
});

const calendarDate = ref(today(getLocalTimeZone())) as Ref<DateValue>;
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <div
        class="flex cursor-default select-none justify-center rounded-full px-3 py-1 transition-colors duration-100 ease-in-out hover:bg-secondary"
      >
        <span class="text-nowrap text-sm font-bold">
          {{ formattedDate }}
        </span>
      </div>
    </PopoverTrigger>
    <PopoverContent class="ml-1.5 mt-1.5 rounded-3xl xs:w-80">
      <div class="flex flex-col items-center">
        <span
          class="w-full text-left text-lg font-bold text-muted-foreground xs:pl-4"
        >
          {{
            Intl.DateTimeFormat("it-IT", {
              dateStyle: "long",
            }).format(new Date())
          }}
        </span>
        <Calendar v-model="calendarDate" class="select-none" />
      </div>
    </PopoverContent>
  </Popover>
</template>

<style scoped></style>
