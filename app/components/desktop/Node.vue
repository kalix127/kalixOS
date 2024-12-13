<script setup lang="ts">
import type { Node, ContextMenuTargetType } from "@/types";
import type { HTMLAttributes } from "vue";
import { toRefs } from "vue";
import { cn } from "@/lib/utils";
import { formatNodeSize } from "@/helpers";
// @ts-ignore
import TableRow from "@/components/ui/table/TableRow.vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  item: Node;
  isDesktop: boolean;
  isGridLayout: boolean;
}>();

const { item, isDesktop, isGridLayout } = toRefs(props);

const { openContextMenu } = useContextMenuStore();
const desktopStore = useDesktopStore();
const { editNode, openApp, updateApp } = desktopStore;
const { setKateNodeId } = useKateStore();
const { setFilesNodeId } = useFilesStore();
const { t, locale } = useI18n();

const itemSize = computed(() => {
  switch (item.value.type) {
    case "file":
      return formatNodeSize(item.value.content?.length || 0);
    case "app":
      return formatNodeSize(item.value.content?.length || 0);
    case "folder":
      return `${item.value.children.length} ${t("items")}`;
    case "shortcut":
      const targetNode = desktopStore.nodeMap.get(item.value.targetId);
      if (targetNode) {
        switch (targetNode.type) {
          case "file":
            return formatNodeSize(targetNode.content?.length || 0);
          case "app":
            return formatNodeSize(targetNode.content?.length || 0);
          case "folder":
            return `${targetNode.children.length} ${t("items")}`;
        }
      }
  }
});

function handleContextMenu(event: MouseEvent) {
  openContextMenu(
    event.clientX,
    event.clientY,
    item.value.type as ContextMenuTargetType,
    item.value,
    isDesktop.value,
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
  <component
    :is="isGridLayout ? 'div' : TableRow"
    @contextmenu.prevent.stop="handleContextMenu"
    @dblclick="handleDoubleClick"
    :aria-label="item.name"
    :class="
      isGridLayout
        ? cn(
            'group relative flex aspect-square cursor-pointer flex-col items-center justify-start text-center transition-all duration-150',
            props.class,
          )
        : ''
    "
  >
    <!-- Grid Layout -->
    <template v-if="isGridLayout">
      <div class="rounded-md p-0.5 group-hover:bg-accent/50">
        <Icon :name="item.icon" size="56" />
      </div>
      <span
        class="max-w-full select-none break-all rounded-md p-0.5 px-1 text-sm group-hover:bg-accent/50"
      >
        {{ item.name }}
      </span>
      <LazyDesktopNodeRenamePopover
        v-model="item.name"
        :item="item"
        @submit="handleStopRenaming"
        @outside="handleStopRenaming"
      />
      <DesktopNodeIcons class="*:absolute *:right-0 *:top-0" :item="item" />
    </template>

    <!-- List Layout -->
    <template v-else>
      <TableCell class="relative flex items-center gap-3 p-2">
        <Icon :name="item.icon" size="30" />
        <span>
          {{ item.name }}
        </span>
        <LazyDesktopNodeRenamePopover
          v-model="item.name"
          :item="item"
          @submit="handleStopRenaming"
          @outside="handleStopRenaming"
        />
        <DesktopNodeIcons :item="item" />
      </TableCell>
      <TableCell class="p-2 text-muted-foreground">{{ itemSize }}</TableCell>
      <TableCell class="p-2 text-muted-foreground">{{
        Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
        }).format(item.createdAt)
      }}</TableCell>
    </template>
  </component>
</template>
