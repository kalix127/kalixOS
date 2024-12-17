<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { defaultFolders } from "@/constants";

defineProps<{
  class?: HTMLAttributes["class"];
}>();

const setDraggable = inject("setDraggable") as (draggable: boolean) => void;
const isMobile = useBreakpoints(breakpointsTailwind).smaller("sm");
const { bookmarksNodes } = storeToRefs(useDesktopStore());

const { setFilesNodeId } = useFilesStore();

function handleItemClick(id: string) {
  setFilesNodeId(id);
}

type SidebarItem = { id: string; name: string; icon: string };

const defaultItems = computed<SidebarItem[]>(() => {
  return [...defaultFolders];
});

const bookmarkItems = computed<SidebarItem[]>(() => {
  return bookmarksNodes.value.map((node) => ({
    ...node,
    icon: "gnome:symbolic-folder",
  }));
});

const hasBookmarks = computed(() => bookmarkItems.value.length > 0);
</script>

<template>
  <ScrollArea
    :class="
      cn(
        'p-2 transition-colors duration-300',
        isMobile ? '' : 'border-r border-r-black/30',
        $props.class,
      )
    "
  >
    <!-- Top-Sidebar -->
    <div
      class="app-topbar hidden h-10 items-start justify-between sm:flex"
      @mouseenter.stop="() => setDraggable(true)"
      @mouseleave.stop="() => setDraggable(false)"
    >
      <div class="grid place-content-center p-2">
        <Icon name="gnome:search" size="16" />
      </div>
      <div class="pt-2 text-sm font-extrabold">
        {{ $t("files") }}
      </div>
      <div class="grid place-content-center p-2">
        <Icon name="gnome:three-dots-vertical" size="18" />
      </div>
    </div>

    <!-- Sidebar -->
    <div class="flex flex-col gap-1.5">
      <!-- Default Items -->
      <button
        v-for="item in defaultItems"
        :key="item.name"
        class="flex w-full items-center gap-3 rounded-md p-2.5 transition-colors duration-200 hover:bg-popover"
        @click="() => handleItemClick(item.id)"
      >
        <div class="grid place-content-center">
          <Icon :name="item.icon" size="16" />
        </div>
        <div class="flex flex-col items-start gap-1">
          <span class="max-w-32 truncate text-sm font-medium">{{
            item.name
          }}</span>
        </div>
      </button>

      <!-- Separator -->
      <div v-if="hasBookmarks" class="h-px w-full bg-gray-500/25"></div>

      <!-- Bookmark Items -->
      <button
        v-for="(item, index) in bookmarkItems"
        :key="`${item.name}-${index}`"
        class="flex w-full items-center gap-3 rounded-md p-2.5 transition-colors duration-200 hover:bg-popover"
        @click="() => handleItemClick(item.id)"
      >
        <div class="grid place-content-center">
          <Icon :name="item.icon" size="16" />
        </div>
        <div class="flex flex-col items-start gap-1">
          <span class="max-w-32 truncate text-sm font-medium">{{
            item.name
          }}</span>
        </div>
      </button>
    </div>
  </ScrollArea>
</template>
