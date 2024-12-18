<script setup lang="ts">
import type { Node } from "@/types";
import { vOnClickOutside } from "@vueuse/components";

const props = defineProps<{
  item: Node;
}>();

defineEmits<{
  (e: "submit"): void;
  (e: "outside"): void;
}>();

const { item } = toRefs(props);
const name = defineModel<string>({ required: true });
</script>

<template>
  <Popover :open="item.isRenaming">
    <PopoverTrigger
      :aria-label="$t('seo.aria.rename_item', { item: item.name })"
    />
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
            v-model="name"
            type="text"
            class="h-9 w-full border-0 bg-accent/60 selection:bg-primary/30 focus-visible:ring-primary/80"
            maxlength="20"
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
