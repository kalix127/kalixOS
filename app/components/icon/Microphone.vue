<script setup lang="ts">
const props = defineProps<{
  inputVolume: number;
  size?: number;
}>();

const { inputVolume } = toRefs(props);

const microphoneIcon = computed(() => {
  switch (true) {
    case inputVolume.value > 50:
      return "gnome:microphone-2";
    case inputVolume.value > 0:
      return "gnome:microphone-1";
    default:
      return "gnome:microphone-off";
  }
});
</script>

<template>
  <Icon
    :name="microphoneIcon"
    :size="size"
  />
</template>

<style scoped></style>
