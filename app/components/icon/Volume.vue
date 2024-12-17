<script setup lang="ts">
const props = defineProps<{
  volume: number;
  size: number;
}>();

const { volume } = toRefs(props);

const volumeIcon = computed(() => {
  switch (true) {
    case volume.value > 66:
      return "gnome:volume-3";
    case volume.value > 33:
      return "gnome:volume-2";
    case volume.value > 0:
      return "gnome:volume-1";
    default:
      return "gnome:volume-off";
  }
});
</script>

<template>
  <Icon :name="volumeIcon" :size="size" />
</template>

<style scoped></style>
