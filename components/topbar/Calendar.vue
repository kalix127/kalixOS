<script setup lang="ts">
import {
  type DateValue,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
import { useIntervalFn } from "@vueuse/core";

const { locale } = useI18n();
const { hasAppsAtTop } = storeToRefs(useDesktopStore());

const currentDate = ref(new Date());

// Hydration Logic
useHydration(
  "currentDate",
  () => currentDate.value.toISOString(),
  (hydratedDate: string) => {
    currentDate.value = new Date(hydratedDate);
  },
);

useIntervalFn(
  () => {
    currentDate.value = new Date();
  },
  100,
  { immediate: true },
);

const formattedDateTime = computed(() => {
  return Intl.DateTimeFormat(locale.value, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(currentDate.value);
});

const weekDay = computed(() =>
  new Intl.DateTimeFormat(locale.value, {
    weekday: "long",
  }).format(currentDate.value),
);

const formattedDate = computed(() =>
  Intl.DateTimeFormat(locale.value, {
    dateStyle: "long",
  }).format(currentDate.value),
);

// Calendar Date State
const calendarDate = ref(today(getLocalTimeZone())) as Ref<DateValue>;
</script>

<template>
  <Popover>
    <PopoverTrigger :aria-label="$t('seo.aria.calendar')">
      <div
        class="flex select-none justify-center rounded-full px-3 py-1 transition-colors duration-100 ease-in-out hover:bg-secondary"
        :class="{ 'hover:bg-secondary/50': !hasAppsAtTop }"
      >
        <span class="text-nowrap text-xs font-extrabold sm:text-sm">
          {{ formattedDateTime }}
        </span>
      </div>
    </PopoverTrigger>
    <PopoverContent
      class="depth-shadow z-[50000] ml-1.5 mt-1.5 rounded-3xl xs:w-80"
    >
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
