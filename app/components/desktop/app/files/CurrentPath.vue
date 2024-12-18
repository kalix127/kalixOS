<script setup lang="ts">
import type { Node } from "@/types";

const props = defineProps<{ absolutePath: string; nodes: Node[] }>();

const { absolutePath, nodes } = toRefs(props);

const { setFilesNodeId } = useFilesStore();

const maxSegments = 3;
const maxSegmentLength = 12;
function truncateSegment(segment: string, maxLength: number): string {
  if (segment.length <= maxLength)
    return segment;
  const start = segment.slice(0, 4);
  const end = segment.slice(-4);
  // Example: ThisIsALongSegment -> This...ment
  return `${start}...${end}`;
}

const displaySegments = computed(() => {
  const pathSegments = absolutePath.value.split("/").filter(Boolean);

  const mappedSegments = pathSegments.map((segment, index) => {
    if (segment === "home")
      return { name: "Home", id: nodes.value[index].id };
    return {
      name: truncateSegment(segment, maxSegmentLength),
      id: nodes.value[index].id,
    };
  });

  if (!absolutePath.value.startsWith("/home")) {
    mappedSegments.unshift({ name: "Manjaro Linux", id: "root" });
  }

  if (mappedSegments.length > maxSegments) {
    return [{ name: "...", id: "" }].concat(mappedSegments.slice(-maxSegments));
  }

  return mappedSegments;
});

const pathIcon = computed(() => {
  return absolutePath.value.startsWith("/home") ? "gnome:home" : "gnome:hdd";
});

function handleClickSegment(id: string) {
  if (!id)
    return;
  setFilesNodeId(id);
}
</script>

<template>
  <div
    class="app-topbar flex h-8 w-full items-center overflow-hidden whitespace-nowrap rounded-md bg-popover pl-2"
  >
    <Icon v-if="pathIcon" :name="pathIcon" size="16" class="mr-2" />
    <div class="flex items-center overflow-hidden text-sm font-bold">
      <div
        v-for="(segment, index) in displaySegments"
        :key="index"
        class="max-w-[10rem] flex-shrink-0 truncate"
      >
        <button
          class="duration-300"
          :class="{
            'text-muted-foreground': index < displaySegments.length - 1,
            'hover:text-foreground': segment.id,
          }"
          @click="() => handleClickSegment(segment.id)"
        >
          {{ segment.name }}
        </button>
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
