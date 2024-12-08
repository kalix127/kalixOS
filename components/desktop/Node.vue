<script setup lang="ts">
import type { Node, ContextMenuTargetType } from "@/types";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { vOnClickOutside } from "@vueuse/components";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  item: Node;
  isDesktop: boolean;
}>();

const { item, isDesktop } = toRefs(props);

const { openContextMenu } = useContextMenuStore();
const desktopStore = useDesktopStore();
const { editNode, openApp, updateApp } = desktopStore;

const { setKateNodeId } = useKateStore();
const { setFilesNodeId } = useFilesStore();


function handleContextMenu(event: MouseEvent) {
  openContextMenu(
    event.clientX,
    event.clientY,
    item.value.type as ContextMenuTargetType,
    item.value,
    isDesktop.value
  );

  // If this component is rendered inside the 'files' app
  if (!isDesktop.value) {
    updateApp("files", { isDropdownOpen: true });
  }
}

function handleDoubleClick(e: MouseEvent) {
  const nodeType = item.value.type;

  switch (nodeType) {
    case "app":
      openApp(item.value.id);
      break;

    case "file":
      setKateNodeId(item.value.id);
      openApp("kate");
      break;

    case "folder":
      setFilesNodeId(item.value.id);
      openApp("files");
      break;

    case "shortcut":
      const { nodeMap } = storeToRefs(desktopStore);
      const targetNode = nodeMap.value.get(item.value.targetId);
      switch (targetNode?.type) {
        case "app":
          openApp(targetNode.id);
          break;

        case "file":
          setKateNodeId(targetNode.id);
          openApp("kate");
          break;

        case "folder":
          setFilesNodeId(targetNode.id);
          openApp("files");
          break;
      }
      break;

    default:
      break;
  }
}

function handleStopRenaming() {
  if (!item.value.isRenaming) return;

  editNode(item.value.id, { isRenaming: false, isNewlyCreated: false });
}
</script>

<template>
  <div
    @contextmenu.prevent.stop="handleContextMenu"
    @dblclick="handleDoubleClick"
    :class="
      cn(
        'group relative flex aspect-square cursor-pointer flex-col items-center justify-start text-center transition-all duration-150',
        props.class,
      )
    "
  >
    <div class="rounded-md p-0.5 group-hover:bg-accent/50">
      <Icon :name="item?.icon" size="56" />
    </div>
    <span
      class="max-w-full select-none break-all rounded-md p-0.5 px-1 text-sm group-hover:bg-accent/50"
      >{{ item.name }}</span
    >
    <!-- Renaming popover -->
    <Popover :open="item.isRenaming">
      <PopoverTrigger> </PopoverTrigger>
      <PopoverContent class="z-[50000] w-72 border-none bg-secondary p-3">
        <div
          v-on-click-outside="() => handleStopRenaming()"
          class="flex flex-col gap-2"
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
        </div>
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
