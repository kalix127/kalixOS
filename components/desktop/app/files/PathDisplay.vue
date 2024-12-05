<script setup lang="ts">
const props = defineProps<{ absolutePath: string }>();

const { absolutePath } = toRefs(props);

const maxSegments = 4;

const displaySegments = computed(() => {
  const pathSegments = absolutePath.value.split("/").filter(Boolean);

  const mappedSegments = pathSegments
    .map((segment) => {
      if (segment === "home") return "Home";
      return segment.charAt(0) + segment.slice(1);
    })
    .filter(Boolean);

  if (!absolutePath.value.startsWith("/home")) {
    mappedSegments.unshift("Manjaro Linux");
  }

  if (mappedSegments.length > maxSegments) {
    return ["..."].concat(mappedSegments.slice(-maxSegments));
  } else {
    return mappedSegments;
  }
});

const pathIcon = computed(() => {
  if (absolutePath.value.startsWith("/home")) {
    return "gnome:home";
  } else {
    return "gnome:hdd";
  }
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
            index < displaySegments.length - 1 ? 'text-muted-foreground' : '',
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
div {
  white-space: nowrap;
}
</style>
