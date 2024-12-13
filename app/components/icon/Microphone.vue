<script setup lang="ts">
const props = defineProps<{
  value: number;
  size?: number;
}>();

const { value } = toRefs(props);

const microphoneIcon = computed(() => {
  switch (true) {
    case value.value > 50:
      return "gnome:microphone-2";
    case value.value > 0:
      return "gnome:microphone-1"; 
    default:
      return "gnome:microphone-off";
  }
});
</script>

<template>
  <Icon :name="microphoneIcon" :size="size" />
</template>

<style scoped></style>
