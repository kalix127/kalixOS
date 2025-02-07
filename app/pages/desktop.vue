<script lang="ts" setup>
import type { Node } from "@/types";
import { dragAndDrop } from "@formkit/drag-and-drop/vue";
import { breakpointsTailwind, until, useBreakpoints } from "@vueuse/core";

definePageMeta({
  layout: "desktop",
  middleware: "login",
});

const { t } = useI18n();
useHead({
  title: computed(() => t("seo.title.desktop")),
  meta: [{ name: "description", content: t("seo.description.desktop") }],
});

const desktopStore = useDesktopStore();
const { desktopItems, openApps, desktopRef, nodeMap }
  = storeToRefs(desktopStore);
const { init, moveNode, updateDesktopItems } = desktopStore;

const isMobileOrTablet = useBreakpoints(breakpointsTailwind).smaller("lg");

const contextMenuStore = useContextMenuStore();
const { openContextMenu } = contextMenuStore;

const desktopGridRef = ref<HTMLElement | null>(null);
const draggableItems = computed({
  get: () => desktopItems.value,
  set: (newItems: Node[]) => {
    updateDesktopItems(newItems);
  },
});

// Context menu handler
function handleContextMenu(event: MouseEvent) {
  openContextMenu(event.clientX, event.clientY, "desktop", null, true);
}

const draggedNodeId = ref<string | null>(null);
const targetNodeId = ref<string | null>(null);

function handleDrop() {
  if (!draggedNodeId.value || !targetNodeId.value) {
    return;
  }

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

onMounted(async () => {
  // Initialize the FileSystem
  init();

  await until(desktopGridRef).toBeTruthy();
  if (!desktopGridRef.value)
    return;

  // Initialize drag-and-drop
  dragAndDrop({
    parent: desktopGridRef.value,
    values: draggableItems,
    sortable: false,
    disabled: isMobileOrTablet.value,

    // Assign dragged and target node ids on mobile
    handleNodePointerover(data) {
      if (!data.detail.state?.currentTargetValue) {
        return;
      }

      draggedNodeId.value = data.detail.state?.currentTargetValue.id;
      targetNodeId.value = data.detail.targetData.node.data.value.id;
    },

    // Assign dragged and target node ids on desktop
    handleNodeDragover(data, state) {
      if (!state.currentTargetValue) {
        return;
      }

      draggedNodeId.value = state.currentTargetValue.id;
      targetNodeId.value = data.targetData.node.data.value.id;
    },

    // Handle drop node for desktop
    handleNodeDrop() {
      handleDrop();
    },

    // Handle drop node for mobile
    handleNodePointerup() {
      handleDrop();
    },
  });
});

onUnmounted(() => {
  desktopStore.$dispose();
  contextMenuStore.$dispose();
  const filesStore = useFilesStore();
  useFilesStore().$dispose();
  // Delete the store state
  desktopStore.$reset();
  contextMenuStore.$reset();
  filesStore.$reset();
});
</script>

<template>
  <main
    ref="desktopRef"
    class="relative select-none"
  >
    <!-- Apps -->
    <TransitionGroup name="apps">
      <LazyDesktopWindow
        v-for="app in openApps"
        v-show="!app.isMinimized"
        :key="app.id"
        :app="app"
      />
    </TransitionGroup>

    <!-- Desktop grid wrapper -->
    <DesktopGrid
      ref="desktopGridRef"
      :aria-label="$t('seo.aria.desktop_grid')"
      @context="handleContextMenu"
    >
      <DesktopNode
        v-for="item in desktopItems"
        :key="item.id"
        :item="item"
        :is-desktop="true"
        :is-grid-layout="true"
      />
    </DesktopGrid>
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
