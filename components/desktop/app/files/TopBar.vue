<script setup lang="ts">
import { getNodeFullPath } from "@/helpers";
import { cn } from "@/lib/utils";
import { vOnClickOutside } from "@vueuse/components";

import type { HTMLAttributes } from "vue";
import type { AppNode } from "@/types";

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

const props = defineProps<{
  class?: HTMLAttributes["class"];
  app: AppNode;
}>();

const { app } = toRefs(props);

const filesStore = useFilesStore();
const { openedNode, isGridView, isSearching, searchQuery } =
  storeToRefs(filesStore);

const desktopStore = useDesktopStore();
const { fileSystem } = storeToRefs(desktopStore);

const actions = computed(() => [
  {
    icon: "gnome:minimize",
    emit: "minimize",
  },
  app.value.isFullscreen
    ? {
        icon: "gnome:collapse",
        emit: "fullscreen",
      }
    : {
        icon: "gnome:expand",
        emit: "fullscreen",
      },
  {
    icon: "gnome:close",
    emit: "close",
  },
]);

const fullPath = computed(() => {
  if (!openedNode.value) return "";
  return getNodeFullPath(fileSystem.value, openedNode.value);
});

function toggleTypeView() {
  isGridView.value = !isGridView.value;
}

function toggleSearch() {
  isSearching.value = !isSearching.value;
}
</script>

<template>
  <div
    :class="[
      cn(
        'flex h-14 items-center justify-between p-2 transition-colors duration-300',
        $props.class,
      ),
    ]"
    @dblclick="$emit('fullscreen')"
  >
    <div
      v-on-click-outside="() => isSearching = false"
      class="flex w-3/5 items-center gap-2"
    >
      <FilesSearchInput v-if="isSearching || searchQuery" />
      <FilesPathDisplay v-else :absolutePath="fullPath" />
      <Button
        @click="toggleSearch"
        @dblclick.stop=""
        variant="ghost"
        size="icon"
        :class="['h-8 hover:bg-popover', isSearching ? 'bg-popover' : '']"
      >
        <Icon name="gnome:folder-search" size="20" class="" />
      </Button>
    </div>

    <div class="flex items-center justify-end gap-2">
      <!-- Change view / general actions -->
      <div class="group flex items-center gap-px" @dblclick.stop="">
        <Button
          variant="ghost"
          size="icon"
          class="size-8 duration-300 hover:bg-popover"
          @click.stop="toggleTypeView"
        >
          <Icon v-show="isGridView" name="gnome:view-grid" size="18" />
          <Icon v-show="!isGridView" name="gnome:view-list" size="18" />
        </Button>
        <div class="h-6 w-px bg-gray-500/50 group-hover:bg-gray-500/20"></div>
        <Button
          variant="ghost"
          size="icon"
          class="size-8 duration-300 hover:bg-popover"
        >
          <Icon name="gnome:pan-down" size="18" />
        </Button>
      </div>

      <!-- Window actions -->
      <Button
        variant="ghost"
        size="icon"
        class="size-6 rounded-full bg-popover duration-300 hover:bg-secondary"
        v-for="action in actions"
        :key="action.icon"
        @click="() => $emit(action.emit)"
      >
        <Icon :name="action.icon" size="18" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>