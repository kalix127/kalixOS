<script setup lang="ts">
const { isSearching, searchQuery } = storeToRefs(useFilesStore());

function stopSearching() {
  searchQuery.value = "";
  isSearching.value = false;
}
</script>

<template>
  <div
    class="relative flex w-full items-center gap-4"
  >
    <Input
      v-model="searchQuery"
      :placeholder="$t('search_in_folder')"
      class="h-8 bg-popover pl-8 pr-14 outline-none ring-2 ring-ring/70 ring-offset-0 focus-visible:ring-ring/70 focus-visible:ring-offset-0"
      type="text"
      v-focus
    />

    <!-- Search icon -->
    <button
      type="button"
      aria-label="Toggle password visibility"
      class="absolute inset-y-0 start-0 flex items-center justify-center px-2"
    >
      <Icon
        name="gnome:search"
        size="16"
        class="text-muted-foreground transition-colors duration-300 hover:text-foreground"
      />
    </button>

    <!-- Backspace icon -->
    <button
      type="button"
      aria-label="Toggle password visibility"
      class="absolute inset-y-0 end-5 flex items-center justify-center px-3"
      @click="() => (searchQuery = '')"
    >
      <Icon
        name="gnome:backspace"
        size="20"
        class="text-muted-foreground transition-colors duration-300 hover:text-foreground"
      />
    </button>

    <!-- Close icon -->
    <button
      type="button"
      aria-label="Toggle password visibility"
      class="absolute inset-y-0 end-0 flex items-center justify-center px-2"
      @click="() => stopSearching()"
    >
      <Icon
        name="gnome:close"
        size="20"
        class="text-muted-foreground transition-colors duration-300 hover:text-foreground"
      />
    </button>
  </div>
</template>

<style scoped></style>
