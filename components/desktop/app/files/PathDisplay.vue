<script setup lang="ts">
const props = defineProps<{ absolutePath: string }>();

const { absolutePath } = toRefs(props);

const maxSegments = 3;

const displaySegments = computed(() => {
  const pathSegments = absolutePath.value.split("/").filter(Boolean);

  const mappedSegments = pathSegments
    .map((segment) => {
      if (segment === "home") return "Home";
      if (segment === "") return "Manjaro Linux";
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .filter(Boolean);

  if (mappedSegments.length > maxSegments) {
    return ["..."].concat(mappedSegments.slice(-maxSegments));
  } else {
    return mappedSegments;
  }
});

const pathIcon = computed(() => {
  if (absolutePath.value.startsWith("/home")) {
    return "gnome:home";
  } else if (absolutePath.value === "/") {
    return "gnome:computer";
  }
  return "";
});
</script>

<template>
  <div
    class="flex h-8 w-full items-center overflow-hidden rounded-md bg-popover pl-2"
  >
    <Icon v-if="pathIcon" :name="pathIcon" size="16" class="mr-2" />
    <div class="flex items-center text-sm font-extrabold">
      <div v-for="(segment, index) in displaySegments" :key="index">
        <span
          :class="[
            index < displaySegments.length - 1
              ? 'text-muted-foreground'
              : '',
          ]"
        >
          {{ segment }}
        </span>
        <span
          v-if="index < displaySegments.length - 1"
          class="mx-2 text-muted-foreground"
        >
          /
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure the path display does not shrink or overflow */
div {
  white-space: nowrap;
}
</style>
