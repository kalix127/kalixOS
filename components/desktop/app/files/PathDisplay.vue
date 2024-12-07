<script setup lang="ts">
const props = defineProps<{ absolutePath: string }>();

const { absolutePath } = toRefs(props);

const maxSegments = 3;
const maxSegmentLength = 12;

function truncateSegment(segment: string, maxLength: number): string {
  if (segment.length <= maxLength) return segment;
  const start = segment.slice(0, 4);
  const end = segment.slice(-4);
  // Example: ThisIsALongSegment -> This...ment
  return `${start}...${end}`;
}

const displaySegments = computed(() => {
  const pathSegments = absolutePath.value.split("/").filter(Boolean);

  const mappedSegments = pathSegments.map((segment) => {
    if (segment === "home") return "Home";
    return truncateSegment(segment, maxSegmentLength);
  });

  if (!absolutePath.value.startsWith("/home")) {
    mappedSegments.unshift("Manjaro Linux");
  }

  if (mappedSegments.length > maxSegments) {
    return ["..."].concat(mappedSegments.slice(-maxSegments));
  }

  return mappedSegments;
});

const pathIcon = computed(() => {
  return absolutePath.value.startsWith("/home") ? "gnome:home" : "gnome:hdd";
});
</script>

<template>
  <div
    class="app-topbar flex h-8 w-full items-center overflow-hidden whitespace-nowrap rounded-md bg-popover pl-2"
  >
    <Icon v-if="pathIcon" :name="pathIcon" size="16" class="mr-2" />
    <div class="flex items-center overflow-hidden text-sm font-extrabold">
      <div
        v-for="(segment, index) in displaySegments"
        :key="index"
        class="max-w-[10rem] flex-shrink-0 overflow-hidden text-ellipsis"
      >
        <span
          :class="
            index < displaySegments.length - 1 ? 'text-muted-foreground' : ''
          "
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

<style scoped></style>
