<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { vOnClickOutside } from "@vueuse/components";
import { useClipboard } from "@vueuse/core";
import { getNodeFullPath } from "@/helpers";
import { cn } from "@/lib/utils";

defineProps<{
  class?: HTMLAttributes["class"];
}>();

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

const isFullscreen = inject("isFullscreen") as Ref<boolean>;

const { t } = useI18n();

const filesStore = useFilesStore();
const {
  openedNode,
  isGridLayout,
  isSearching,
  searchQuery,
  canMoveBack,
  canMoveForward,
} = storeToRefs(filesStore);
const { moveBack, moveForward, toggleGridView } = filesStore;

const desktopStore = useDesktopStore();
const { fileSystem } = storeToRefs(desktopStore);
const { createNode, openApp, addNotification, updateApp } = desktopStore;
const { setCurrentDirectory } = useTerminalStore();

const { copy, isSupported } = useClipboard();

const windowActions = computed(() => [
  {
    icon: "gnome:minimize",
    emit: "minimize",
  },
  isFullscreen.value
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

const generalActions = computed(() => [
  { label: t("new_folder"), action: () => createNewFolder() },
  { label: t("new_document"), action: () => createNewDocument() },
  { isSeparator: true },
  { label: t("open_in_terminal"), action: () => openInTerminal() },
  { label: t("copy_location"), action: () => copyLocation() },
]);

const fullPath = computed(() => {
  if (!openedNode.value)
    return { absolutePath: "", nodes: [] };
  return getNodeFullPath(fileSystem.value, openedNode.value);
});

function toggleSearch() {
  isSearching.value = !isSearching.value;
}

function createNewFolder() {
  if (openedNode.value) {
    createNode(
      openedNode.value.id,
      {
        name: t("new_folder"),
        type: "folder",
      },
      true,
    );
  }
}

function createNewDocument() {
  if (openedNode.value) {
    createNode(
      openedNode.value.id,
      {
        name: t("new_document"),
        type: "file",
      },
      true,
    );
  }
}

function openInTerminal() {
  if (!openedNode.value)
    return;
  setCurrentDirectory(openedNode.value);
  openApp("terminal");
}

function copyLocation() {
  if (!isSupported.value) {
    addNotification({
      id: "clipboard-not-supported",
      title: "clipboard_not_supported_title",
      description: "clipboard_not_supported_description",
      icon: "gnome:triangle-warning",
      isTranslated: true,
    });
    return;
  }

  copy(fullPath.value.absolutePath);
}
</script>

<template>
  <div
    :class="
      cn(
        'flex h-12 items-center justify-between gap-2 p-2 transition-colors duration-300',
        $props.class,
      )
    "
    @dblclick="() => $emit('fullscreen')"
  >
    <div
      v-on-click-outside="() => (isSearching = false)"
      class="flex w-full items-center gap-2"
      @dblclick.stop=""
    >
      <!-- Back / forward arrows -->
      <div class="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          :disabled="!canMoveBack"
          class="size-8 duration-300 hover:bg-popover"
          :class="{
            'text-muted-foreground': !canMoveBack,
          }"
          @click="moveBack"
        >
          <Icon
            name="gnome:arrow-long-left"
            size="18"
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          :disabled="!canMoveForward"
          class="size-8 duration-300 hover:bg-popover"
          :class="{
            'text-muted-foreground': !canMoveBack,
          }"
          @click="moveForward"
        >
          <Icon
            name="gnome:arrow-long-right"
            size="18"
          />
        </Button>
      </div>

      <!-- Path / input -->
      <Transition
        name="search-input"
        mode="out-in"
      >
        <FilesSearchInput v-if="isSearching || searchQuery" />
        <FilesCurrentPath
          v-else
          :absolute-path="fullPath.absolutePath"
          :nodes="fullPath.nodes"
        />
      </Transition>

      <!-- Search in folder -->
      <Button
        variant="ghost"
        size="icon"
        class="h-8 hover:bg-popover"
        :class="{ 'bg-popover': isSearching }"
        @click="toggleSearch"
      >
        <Icon
          name="gnome:folder-search"
          size="20"
          class=""
        />
      </Button>
    </div>

    <div class="flex items-center justify-end gap-2">
      <div
        class="group flex items-center gap-px"
        @dblclick.stop=""
      >
        <!-- Change view / -->
        <Button
          variant="ghost"
          size="icon"
          class="size-8 duration-300 hover:bg-popover"
          @click.stop="toggleGridView"
        >
          <Icon
            v-show="isGridLayout"
            name="gnome:view-list"
            size="18"
          />
          <Icon
            v-show="!isGridLayout"
            name="gnome:view-grid"
            size="18"
          />
        </Button>
        <div class="h-6 w-px bg-gray-500/50 group-hover:bg-gray-500/20" />

        <!-- General actions  -->
        <DropdownMenu
          @update:open="
            (value) => updateApp('files', { isDropdownOpen: value })
          "
        >
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="size-8 duration-300 hover:bg-popover"
            >
              <Icon
                name="gnome:pan-down"
                size="18"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="z-[50000] min-w-40 font-medium">
            <div
              v-for="option in generalActions"
              :key="option.label"
              @contextmenu.prevent=""
            >
              <DropdownMenuSeparator v-if="option.isSeparator" />

              <DropdownMenuItem
                v-else
                @click="option.action"
              >
                {{ option.label }}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- Window actions -->
      <Button
        v-for="action in windowActions"
        :key="action.icon"
        variant="ghost"
        size="icon"
        class="size-6 rounded-full bg-popover duration-300 hover:bg-secondary"
        @click="() => $emit(action.emit)"
        @dblclick.stop=""
      >
        <Icon
          :name="action.icon"
          size="18"
        />
      </Button>
    </div>
  </div>
</template>

<style scoped>
.search-input-enter-active,
.search-input-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.search-input-enter-from,
.search-input-leave-to {
  opacity: 0.5;
}
</style>
