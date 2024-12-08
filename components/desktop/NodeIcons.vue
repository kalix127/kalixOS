<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import type { Node } from "@/types";
const props = defineProps<{ class?: HTMLAttributes["class"]; item: Node }>();
const { item } = toRefs(props);
</script>

<template>
  <div
    :class="
      cn(
        '*:grid *:place-content-center *:rounded-full *:bg-secondary',
        $props.class,
      )
    "
  >
    <div v-if="item.type === 'shortcut'" class="p-0.5">
      <Icon name="gnome:arrow-shortcut" size="12" class="text-white" />
    </div>
    <div v-else-if="item.isProtected" class="p-[3px]">
      <Icon name="gnome:lock" size="11" class="text-white" />
    </div>
  </div>
</template>
