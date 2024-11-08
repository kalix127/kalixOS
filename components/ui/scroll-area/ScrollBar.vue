<script setup lang="ts">
import { cn } from '@/lib/utils'
import { ScrollAreaScrollbar, type ScrollAreaScrollbarProps, ScrollAreaThumb } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = withDefaults(defineProps<ScrollAreaScrollbarProps & { class?: HTMLAttributes['class'] }>(), {
  orientation: 'vertical',
})

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ScrollAreaScrollbar
    v-bind="delegatedProps"
    :class="
      cn('flex touch-none select-none transition-colors',
         orientation === 'vertical'
           && 'h-full w-1.5 border-l border-l-transparent p-px hover:w-3 transition-[width] duration-200',
         orientation === 'horizontal'
           && 'h-1.5 flex-col border-t border-t-transparent p-px hover:h-3 transition-[height] duration-200',
         props.class)"
  >
    <ScrollAreaThumb class="relative flex-1 rounded-full bg-secondary" />
  </ScrollAreaScrollbar>
</template>
