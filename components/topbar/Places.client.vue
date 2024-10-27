<script setup lang="ts">
const { hasAppsAtTop } = storeToRefs(useDesktopStore());

// TODO: Add actions
const items = [
  {
    name: "Home",
    icon: "gnome:home",
    action: () => console.log("Home"),
  },
  {
    name: "Documents",
    icon: "gnome:documents",
    action: () => console.log("Documents"),
  },
  {
    name: "Downloads",
    icon: "gnome:downloads",
    action: () => console.log("Downloads"),
  },
  {
    name: "Music",
    icon: "gnome:music",
    action: () => console.log("Music"),
  },
  {
    name: "Pictures",
    icon: "gnome:pictures",
    action: () => console.log("Pictures"),
  },
  {
    name: "Videos",
    icon: "gnome:videos",
    action: () => console.log("Videos"),
  },
  {
    name: "Trash",
    icon: "gnome:trash",
    action: () => console.log("Trash"),
  },
];
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <div
        class="flex min-h-7 cursor-default select-none items-center gap-1.5 rounded-full px-3 py-1 transition-colors duration-100 ease-in-out hover:bg-secondary"
        :class="!hasAppsAtTop ? 'hover:bg-secondary/50' : ''"
      >
        <div class="h-2 w-7 rounded-full bg-white"></div>
        <div class="h-1.5 w-1.5 rounded-full bg-muted-foreground"></div>
      </div>
    </PopoverTrigger>
    <PopoverContent class="z-[50000] ml-1.5 mt-1.5 w-52 rounded-2xl p-2">
      <Button
        v-for="item in items"
        :key="item.name"
        variant="ghost"
        class="flex w-full cursor-default justify-start gap-2 rounded-xl duration-0 hover:bg-secondary"
        @click="item.action"
      >
        <Icon :name="item.icon" size="16" />
        <span class="text-sm">{{ item.name }}</span>
      </Button>
    </PopoverContent>
  </Popover>
</template>

<style scoped></style>
