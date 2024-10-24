<script lang="ts" setup>
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import type { FileSystemNode } from "@/types";
import { until } from "@vueuse/core";

definePageMeta({
  layout: "desktop",
  middleware: "login",
});

const desktopStore = useDesktopStore();
const { desktopItems, openApps } = storeToRefs(desktopStore);
const { init, moveItem, updateDesktopItems } = desktopStore;

const contextMenuStore = useContextMenuStore();
const { openContextMenu } = contextMenuStore;

const desktopGridRef = ref<HTMLElement | null>(null);
const draggableItems = computed({
  get: () => desktopItems.value,
  set: (newItems: FileSystemNode[]) => {
    updateDesktopItems(newItems);
  },
});

// Context menu handler
const handleContextMenu = (event: MouseEvent) => {
  openContextMenu(event.clientX, event.clientY, "desktop");
};

const draggedNodeId = ref<string | null>(null);
const targetNodeId = ref<string | null>(null);

function handleDrop() {
  if (!draggedNodeId.value || !targetNodeId.value) {
    console.error("No dragged or target node id");
    return;
  }

  moveItem(draggedNodeId.value, targetNodeId.value);
}

onMounted(async () => {
  // Initialize the FileSystem
  init();

  await until(desktopGridRef).toBeTruthy();

  // Initialize drag-and-drop
  dragAndDrop({
    parent: desktopGridRef.value,
    values: draggableItems,
    sortable: false,

    // Assign dragged and target node ids on mobile
    handleNodePointerover(data, state) {
      if (!data.detail.state?.currentTargetValue) {
        console.error("No current target value");
        return;
      }

      draggedNodeId.value = data.detail.state?.currentTargetValue.id;
      targetNodeId.value = data.detail.targetData.node.data.value.id;
    },

    // Assign dragged and target node ids on desktop
    handleNodeDragover(data, state) {
      if (!state.currentTargetValue) {
        console.error("No current target value");
        return;
      }

      draggedNodeId.value = state.currentTargetValue.id;
      targetNodeId.value = data.targetData.node.data.value.id;
    },

    // Handle drop node for desktop
    handleNodeDrop(data, state) {
      handleDrop();
    },

    // Handle drop node for mobile
    handleNodePointerup(data, state) {
      handleDrop();
    },
  });
});
</script>

<template>
  <main class="relative">
    <!-- Background image -->
    <NuxtImg
      src="/img/bg-desktop.jpg"
      class="absolute -z-[1] h-full w-full object-cover"
      style="-webkit-user-drag: none"
    />

    <!-- Apps -->
    <TransitionGroup name="apps">
      <DesktopApps v-for="app in openApps" :key="app.id" :app="app" />
    </TransitionGroup>

    <!-- Desktop grid wrapper -->
    <ClientOnly>
      <DesktopGridWrapper @context="handleContextMenu" ref="desktopGridRef">
        <DesktopGridCell
          v-for="item in desktopItems"
          :key="item.id"
          :item="item"
        />
      </DesktopGridWrapper>
    </ClientOnly>

  </main>
</template>

<style scoped>
.apps-enter-active,
.apps-leave-active {
  transition: all 0.2s ease;
}

.apps-enter-from,
.apps-leave-to {
  opacity: 0;
}
</style>
