<script setup lang="ts">
import type { Node, ContextMenuTargetType } from "@/types";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  item: Node;
}>();

const { openContextMenu } = useContextMenuStore();
const desktopStore = useDesktopStore();
const { editNode, openApp } = desktopStore;

const formattedName = computed(() => {
  return props.item?.name.length > 21
    ? props.item?.name.slice(0, 21) + "..."
    : props.item?.name;
});

function handleContextMenu(event: MouseEvent) {
  openContextMenu(
    event.clientX,
    event.clientY,
    props.item.type as ContextMenuTargetType,
    props.item,
  );
}

// Double-click handler
function handleDoubleClick(e: MouseEvent) {
  const nodeType = props.item.type;

  switch (nodeType) {
    case "file":
      // Set the node in the text editor store
      const { setFileNode } = useKateStore();
      setFileNode(props.item);
      // Open the 'Kate' app
      openApp("kate");
      break;

    case "folder":
      // TODO: Implement files app first
      // openApp('files')
      break;

    case "shortcut":
      openApp(props.item.targetId);
      break;

    case "app":
      // TODO: Implement
      break;

    default:
      break;
  }
}

function handleStopRenaming() {
  editNode(props.item.id, { isRenaming: false, isNewlyCreated: false });
}
</script>

<template>
  <div
    @contextmenu.prevent.stop="handleContextMenu"
    @dblclick="handleDoubleClick"
    :class="
      cn(
        'group relative flex aspect-square flex-col items-center justify-start text-center transition-all duration-150 cursor-pointer',
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
      <PopoverTrigger> </PopoverTrigger>
      <PopoverContent
        class="flex w-72 flex-col gap-2 border-none bg-secondary p-3"
      >
        <span class="text-sm font-medium">
          {{
            item.type === "file"
              ? $t("rename_file_title")
              : $t("rename_folder_title")
          }}
        </span>
        <form
          class="flex items-center gap-2"
          spellcheck="false"
          @submit.prevent="handleStopRenaming"
        >
          <Input
            type="text"
            class="h-9 w-full border-0 bg-accent/60 selection:bg-primary/30 focus-visible:ring-primary/80"
            maxlength="20"
            v-model="item.name"
          />
          <Button
            size="sm"
            class="w-fit font-extrabold"
            @click="handleStopRenaming"
          >
            {{ item.isNewlyCreated ? "OK" : $t("rename") }}
          </Button>
        </form>
      </PopoverContent>
    </Popover>

    <!-- Shortcut icon -->
    <div
      v-if="item.type === 'shortcut'"
      class="absolute right-1 top-0 grid place-content-center rounded-full bg-secondary p-0.5"
    >
      <Icon name="gnome:arrow-shortcut" size="12" class="text-white" />
    </div>
  </div>
</template>

<style scoped></style>
