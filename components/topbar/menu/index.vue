<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
  isOpen: boolean;
  isEnabled?: boolean;
}>();
</script>

<template>
  <Collapsible :open="isOpen">
    <CollapsibleContent>
      <div class="mt-4 select-none space-y-4 rounded-2xl bg-secondary p-4">
        <div class="flex items-center gap-4">
          <div
            class="grid place-content-center rounded-full p-2"
            :class="[isEnabled ? 'bg-primary' : 'bg-accent']"
          >
            <Icon :name="icon" size="26" />
          </div>
          <span class="text-xl font-extrabold">
            {{ title }}
          </span>
        </div>
        <div class="space-y-2">
          <slot />
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>

<style scoped></style>
