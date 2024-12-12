<script setup lang="ts">
import { defaultFolders } from "@/constants";

const desktopStore = useDesktopStore();
const { hasAppsAtTop } = storeToRefs(desktopStore);
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
        :class="{ 'hover:bg-secondary/50': !hasAppsAtTop }"
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
    </PopoverContent>
  </Popover>
</template>

<style scoped></style>
