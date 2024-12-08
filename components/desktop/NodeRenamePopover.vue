<script setup lang="ts">
import type { Node } from "@/types";
import { vOnClickOutside } from "@vueuse/components";

const props = defineProps<{
  item: Node;
}>();

const { item } = toRefs(props);
const emit = defineEmits(["submit", "outside"]);
const name = defineModel<string>({ required: true });
</script>

<template>
  <Popover :open="item.isRenaming">
    <PopoverTrigger></PopoverTrigger>
    <PopoverContent class="z-[50000] w-72 border-none bg-secondary p-3">
      <div
        v-on-click-outside="() => $emit('outside')"
        class="flex flex-col gap-2"
      >
        <span class="text-sm font-medium">{{
          item.type === "file"
            ? $t("rename_file_title")
            : $t("rename_folder_title")
        }}</span>
        <form
          class="flex items-center gap-2"
          spellcheck="false"
          @submit.prevent="() => $emit('submit')"
        >
          <Input
            type="text"
            class="h-9 w-full border-0 bg-accent/60 selection:bg-primary/30 focus-visible:ring-primary/80"
            maxlength="20"
            v-model="name"
          />
          <Button
            size="sm"
            class="w-fit font-extrabold"
            @click="() => $emit('submit')"
          >
            OK
          </Button>
        </form>
      </div>
    </PopoverContent>
  </Popover>
</template>
