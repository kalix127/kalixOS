<script setup lang="ts">
import type { FileSystemNode } from "@/types";
import { useContextMenuStore } from "@/stores/contextMenu.store";
import { useDesktopStore } from "@/stores/desktop.store";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  item: FileSystemNode;
}>();

const contextMenuStore = useContextMenuStore();
const desktopStore = useDesktopStore();
const { editItem } = desktopStore;

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

const handleStopRenaming = () => {
  editItem(props.item.id, { isRenaming: false });
};
</script>

<template>
  <div
    @contextmenu.prevent.stop="handleContextMenu"
    :class="
      cn(
        'group flex aspect-square h-full w-full flex-col items-center justify-start text-center transition-all duration-150',
        props.class,
      )
    "
  >
    <div class="rounded-md p-0.5 group-hover:bg-accent/50">
      <Icon :name="item?.icon" size="56" />
    </div>
    <span
      class="max-w-full select-none break-all rounded-md p-0.5 px-1 text-sm group-hover:bg-accent/50"
      >{{ formattedName }}</span
    >
    <!-- Renaming popover -->
    <Popover :open="item.isRenaming" @update:open="handleStopRenaming">
      <PopoverTrigger></PopoverTrigger>
      <PopoverContent class="flex w-64 flex-col gap-2 p-3">
        <span class="text-sm font-medium"
          >{{
            item.type.charAt(0).toUpperCase() + item.type.slice(1)
          }}
          name</span
        >
        <form
          class="flex items-center gap-2"
          @submit.prevent="handleStopRenaming"
        >
          <Input
            class="w-2/3 border-0 h-9 bg-secondary focus-visible:ring-primary/60"
            v-model="item.name"
          />
          <Button
            size="sm"
            class="font-extrabold w-1/3 cursor-default"
            @click="handleStopRenaming"
            >Rename</Button
          >
        </form>
      </PopoverContent>
    </Popover>
  </div>
</template>

<style scoped></style>
