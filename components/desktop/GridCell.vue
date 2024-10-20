<script setup lang="ts">
import type { FileSystemNode } from "@/types";
import { useContextMenuStore } from "@/stores/contextMenu.store";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  item: FileSystemNode;
}>();

const contextMenuStore = useContextMenuStore();

const formattedName = computed(() => {
  return props.item?.name.length > 21
    ? props.item?.name.slice(0, 21) + "..."
    : props.item?.name;
});

const handleContextMenu = (event: MouseEvent) => {
  contextMenuStore.openContextMenu(
    event.clientX,
    event.clientY,
    props.item.type,
    props.item,
  );
};
</script>

<template>
  <div
    @contextmenu.prevent.stop="handleContextMenu"
    :class="cn('group flex aspect-square h-full w-full flex-col items-center justify-start text-center transition-all duration-150', props.class)"
  >
    <div class="rounded-md p-0.5 group-hover:bg-accent/50">
      <Icon :name="item?.icon" size="56" />
    </div>
    <span
      class="max-w-full select-none break-all rounded-md p-0.5 px-1 text-sm group-hover:bg-accent/50"
      >{{ formattedName }}</span
    >
  </div>
</template>

<style scoped></style>
