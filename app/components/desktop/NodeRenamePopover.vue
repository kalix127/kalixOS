<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";

const { t } = useI18n();
const desktopStore = useDesktopStore();
const { editNode } = desktopStore;

const contextMenuStore = useContextMenuStore();
const { closeRenamePopover } = contextMenuStore;
const { renamePopoverPosition } = storeToRefs(contextMenuStore);

const name = ref(renamePopoverPosition.value?.node?.name);

const title = computed(() => {
  return renamePopoverPosition.value?.node?.type === "file"
    ? t("rename_file_title")
    : t("rename_folder_title");
});

function handleStopRenaming() {
  if (!renamePopoverPosition.value?.node)
    return;
  editNode(renamePopoverPosition.value.node.id, { isRenaming: false });
  closeRenamePopover();
}

function handleSubmit() {
  if (!renamePopoverPosition.value?.node)
    return;
  editNode(renamePopoverPosition.value.node.id, {
    isRenaming: false,
    name: name.value,
  });
  closeRenamePopover();
}
</script>

<template>
  <div
    :style="{
      left: `${renamePopoverPosition?.x}px`,
      top: `${renamePopoverPosition?.y}px`,
    }"
    class="absolute z-[50000] w-72 border-none bg-secondary p-3 rounded-lg"
  >
    <div
      v-on-click-outside="handleStopRenaming"
      class="flex flex-col gap-2"
    >
      <span class="text-sm font-medium">{{ title }}</span>
      <form
        class="flex items-center gap-2"
        spellcheck="false"
        @submit.prevent="handleSubmit"
        @key.enter.prevent="handleSubmit"
      >
        <Input
          id="rename-input"
          v-model="name"
          v-focus
          type="text"
          class="h-9 w-full border-0 bg-accent/60 selection:bg-primary/30 focus-visible:ring-primary/80"
          maxlength="20"
        />
        <Button
          size="sm"
          class="w-fit font-bold"
          @click.prevent="handleSubmit"
        >
          OK
        </Button>
      </form>
    </div>
  </div>
</template>
