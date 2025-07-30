<script lang="ts" setup>
import {
  CalendarPrev,
  type CalendarPrevProps,
  useForwardProps,
} from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const props = defineProps<
  CalendarPrevProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <CalendarPrev
    :class="
      cn(
        buttonVariants({ variant: 'outline' }),
        'h-7 w-7 rounded-full border-none bg-transparent p-0 opacity-50 hover:opacity-100',
        props.class,
      )
    "
    v-bind="forwardedProps"
  >
    <slot>
      <Icon
        name="gnome:arrow-left"
        size="18"
      />
    </slot>
  </CalendarPrev>
</template>
