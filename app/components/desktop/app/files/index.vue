<script setup lang="ts">
import type { Node } from "@/types";
import type { HTMLAttributes } from "vue";
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { until } from "@vueuse/core";
import { storeToRefs } from "pinia";

defineProps<{
  class?: HTMLAttributes["class"];
}>();

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

const isFullscreen = inject("isFullscreen") as Ref<boolean>;
const isActive = inject("isActive") as Ref<boolean>;
const localHeight = inject("localHeight") as Ref<number>;
const setDraggable = inject("setDraggable") as (draggable: boolean) => void;

const { openedNode, searchQuery, isGridLayout } = storeToRefs(useFilesStore());
const desktopStore = useDesktopStore();
const { nodeMap } = storeToRefs(desktopStore);
const { moveNode } = desktopStore;

const filesGridRef = ref<HTMLElement | null>(null);
const filesListRef = ref<HTMLElement | null>(null);

const filteredItems = computed({
  get: () =>
    openedNode.value?.children.filter((node) => {
      return node.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    }) || [],
  set: (newItems: Node[]) => newItems,
});

const draggedNodeId = ref<string | null>(null);
const targetNodeId = ref<string | null>(null);

function handleDrop() {
  if (!draggedNodeId.value || !targetNodeId.value)
    return;

  // If target is a shortcut, check if it points to a folder and move item there
  const targetNode = nodeMap.value.get(targetNodeId.value);
  if (targetNode?.type === "shortcut") {
    const targetFolder = nodeMap.value.get(targetNode.targetId);
    if (targetFolder?.type === "folder") {
      moveNode(draggedNodeId.value, targetFolder.id);
      return;
    }
  }

  moveNode(draggedNodeId.value, targetNodeId.value);
}

function initDragAndDrop(parent: HTMLElement) {
  dragAndDrop({
    parent,
    values: filteredItems,
    sortable: false,
    handleNodeDragover(data, state) {
      if (!state.currentTargetValue)
        return;

      draggedNodeId.value = state.currentTargetValue.id;
      targetNodeId.value = data.targetData.node.data.value.id;
    },
    handleNodeDrop() {
      handleDrop();
    },
  });
}

onMounted(async () => {
  await until(filesGridRef).toBeTruthy();
  await until(filesListRef).toBeTruthy();

  if (filesGridRef.value)
    initDragAndDrop(filesGridRef.value);
  if (filesListRef.value)
    initDragAndDrop(filesListRef.value);
});
</script>

<template>
  <div
    class="grid h-full w-full grid-cols-[minmax(max-content,25%)_1fr] grid-rows-[auto_1fr] bg-background transition-all duration-300"
    :class="{
      'rounded-t-xl': !isFullscreen,
      'brightness-[0.85]': !isActive,
    }"
  >
    <!-- Sidebar -->
    <FilesSidebar
      :style="{ height: `${localHeight}px` }"
      class="col-start-1 row-span-2 row-start-1 bg-muted"
      :class="{
        'rounded-tl-xl': !isFullscreen,
      }"
    />

    <!-- Topbar -->
    <FilesTopBar
      class="app-topbar'col-start-2 row-start-1"
      @minimize="$emit('minimize')"
      @fullscreen="$emit('fullscreen')"
      @close="$emit('close')"
      @mouseenter.stop="() => setDraggable(true)"
      @mouseleave.stop="() => setDraggable(false)"
    />

    <!-- Content -->
    <ScrollArea
      class="col-start-2 row-start-2 p-2"
      :style="{
        height: `${localHeight - 48}px`,
      }"
      @contextmenu.prevent=""
    >
      <div
        v-show="isGridLayout"
        ref="filesGridRef"
        class="grid-wrapper"
      >
        <DesktopNode
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          :is-desktop="false"
          :is-grid-layout="isGridLayout"
        />
      </div>

      <Table v-show="!isGridLayout">
        <TableHeader>
          <TableRow class="*:h-2 *:pl-2">
            <TableHead class="w-4/6 py-1.5">
              {{ $t("name") }}
            </TableHead>
            <TableHead class="w-1/6 py-1.5">
              {{ $t("size") }}
            </TableHead>
            <TableHead class="w-1/6 py-1.5">
              {{ $t("modified") }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody ref="filesListRef">
          <DesktopNode
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            :is-desktop="false"
            :is-grid-layout="isGridLayout"
          />
        </TableBody>
      </Table>

      <!-- No results -->
      <div
        v-if="filteredItems?.length === 0 && searchQuery"
        class="grid place-content-center"
        :style="{
          height: `${localHeight - 48}px`,
        }"
      >
        <div class="flex flex-col items-center gap-4">
          <Icon name="gnome:folder-search" size="160" />
          <h2 class="text-2xl font-bold">{{ $t("no_results_found") }}</h2>
          <p class="text-muted-foreground">
            {{ $t("no_match_in_x", { folderName: openedNode?.name }) }}
          </p>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>

<style scoped>
.grid-wrapper {
  @apply grid place-content-start gap-4;
  @apply grid-cols-[repeat(auto-fill,minmax(90px,1fr))];
}
</style>
