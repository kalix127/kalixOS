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
    <!-- Renaming popover -->
    <Popover :open="item.isRenaming" @update:open="handleStopRenaming">
      <PopoverTrigger>
      </PopoverTrigger>
      <PopoverContent
        class="relative flex w-72 flex-col gap-2 bg-secondary p-3"
      >
        <!-- Triangle shape -->
        <div
          class="sm:block hidden absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 -translate-y-full transform border-b-[10px] border-l-[8px] border-r-[8px] border-b-secondary border-l-transparent border-r-transparent"
        ></div>

        <span class="text-sm font-medium">
          {{
            item.type === "file"
              ? $t("desktop.rename_file_title")
              : $t("desktop.rename_folder_title")
          }}
        </span>
        <form
          class="flex items-center gap-2"
          spellcheck="false"
          @submit.prevent="handleStopRenaming"
        >
          <Input
            class="h-9 w-2/3 border-0 bg-accent/60 selection:bg-primary/30 focus-visible:ring-primary/80"
            v-model="item.name"
          />
          <Button
            size="sm"
            class="w-1/3 cursor-default font-extrabold"
            @click="handleStopRenaming"
          >
            {{ $t("desktop.rename") }}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
    <span
      class="max-w-full select-none break-all rounded-md p-0.5 px-1 text-sm group-hover:bg-accent/50"
      >{{ formattedName }}</span
    >
  </div>
</template>

<style scoped></style>
