<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { Notification } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
  notification: Notification;
}

const props = defineProps<Props>();

const { title, description, isTranslated, icon } = toRefs(
  props.notification,
);
</script>

<template>
  <Alert
    :class="
      cn('z-[50000] w-72 border-none bg-popover xs:w-80 sm:w-96', $props.class)
    "
  >
    <div class="flex items-center gap-4">
      <Icon :name="icon" :size="28" />
      <div class="space-y-2">
        <AlertTitle class="font-extrabold tracking-normal">
          {{ isTranslated ? $t(title) : title }}
        </AlertTitle>
        <AlertDescription class="text-xs">
          {{ isTranslated ? $t(description) : description }}
        </AlertDescription>
      </div>
    </div>
  </Alert>
</template>

<style scoped></style>
