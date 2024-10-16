<script setup lang="ts">
import { type Ref, ref } from "vue";
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { Calendar } from "@/components/ui/calendar";

const currentDate = ref(new Date());

const { locale } = useI18n();

onMounted(() => {
  const intervalId = setInterval(() => {
    currentDate.value = new Date();
  }, 100);
  
  onUnmounted(() => {
    clearInterval(intervalId);
  });
});

const formattedDateTime = computed(() => {
  return Intl.DateTimeFormat(locale.value, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(currentDate.value);
});

const weekDay = computed(
  () =>
    new Intl.DateTimeFormat(locale.value, {
      dateStyle: "full",
    })
      .format(new Date())
      .split(" ")[0],
);

const formattedDate = computed(() =>
  Intl.DateTimeFormat(locale.value, {
    dateStyle: "long",
  }).format(new Date()),
);

const calendarDate = ref(today(getLocalTimeZone())) as Ref<DateValue>;
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <div
        class="flex cursor-default select-none justify-center rounded-full px-3 py-1 transition-colors duration-100 ease-in-out hover:bg-secondary"
      >
        <span class="text-nowrap text-sm font-extrabold">
          {{ formattedDateTime }}
        </span>
      </div>
    </PopoverTrigger>
    <PopoverContent class="ml-1.5 mt-1.5 rounded-3xl xs:w-80">
      <div class="flex select-none flex-col items-center">
        <span
          class="text-md w-full text-left font-bold text-muted-foreground xs:pl-4"
        >
          {{ weekDay }}
        </span>
        <span
          class="mb-2 w-full text-left text-xl font-extrabold text-muted-foreground xs:pl-4"
        >
          {{ formattedDate }}
        </span>
        <Calendar v-model="calendarDate" />
      </div>
    </PopoverContent>
  </Popover>
</template>

<style scoped></style>
