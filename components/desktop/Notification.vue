<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
  title: string;
  description: string;
  icon: string;
  iconSize?: number;
}

withDefaults(defineProps<Props>(), {
  iconSize: 28,
});
</script>

<template>
  <Alert
    :class="
      cn('z-[50000] w-72 border-none bg-popover xs:w-80 sm:w-96', $props.class)
    "
  >
    <div class="flex items-center gap-4">
      <Icon :name="icon" :size="iconSize" />
      <div class="space-y-1">
        <AlertTitle class="font-extrabold tracking-normal">
          {{ $t(title) }}
        </AlertTitle>
        <AlertDescription class="text-xs">
          {{ $t(description) }}
        </AlertDescription>
      </div>
    </div>
  </Alert>
</template>

<style scoped></style>
