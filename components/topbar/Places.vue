<script setup lang="ts">
import { defaultFolders } from "@/constants";

const desktopStore = useDesktopStore();
const { hasAppsAtTop, bookmarksNodes } = storeToRefs(desktopStore);
const { openApp } = desktopStore;

const { setFilesNodeId } = useFilesStore();

function openFolder(id: string) {
  setFilesNodeId(id);
  openApp("files");
}
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <div
        class="flex min-h-7 select-none items-center gap-1.5 rounded-full px-3 py-1 transition-colors duration-100 ease-in-out hover:bg-secondary"
        :class="!hasAppsAtTop ? 'hover:bg-secondary/50' : ''"
      >
        <div class="h-2 w-7 rounded-full bg-white"></div>
        <div class="h-1.5 w-1.5 rounded-full bg-muted-foreground"></div>
      </div>
    </PopoverTrigger>
    <PopoverContent
      class="depth-shadow z-[50000] ml-1.5 mt-1.5 w-52 rounded-2xl p-2"
    >
      <Button
        v-for="item in defaultFolders"
        :key="item.name"
        variant="ghost"
        class="flex w-full justify-start gap-2 rounded-xl duration-0 hover:bg-secondary"
        @click="() => openFolder(item.id)"
      >
        <Icon :name="item.icon" size="16" />
        <span class="text-sm">{{ item.name }}</span>
      </Button>

      <div
        v-if="bookmarksNodes.length > 0"
        class="my-2 h-px w-full bg-gray-500/30"
      ></div>

      <Button
        v-for="item in bookmarksNodes.slice(0, 4)"
        :key="item.name"
        variant="ghost"
        class="flex w-full justify-start gap-2 rounded-xl duration-0 hover:bg-secondary"
        @click="() => openFolder(item.id)"
      >
        <Icon name="gnome:symbolic-folder" size="16" />
        <span class="text-sm">{{ item.name }}</span>
      </Button>
      <div v-if="bookmarksNodes.length > 4" class="grid place-content-center">
        <span class="select-none text-muted-foreground">...</span>
      </div>
    </PopoverContent>
  </Popover>
</template>

<style scoped></style>
