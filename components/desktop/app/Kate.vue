<script lang="ts" setup>
import "@/assets/js/monacoWorker";
import * as monaco from "monaco-editor";
import type { HTMLAttributes } from "vue";
import type { AppNode } from "@/types";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  app: AppNode;
}>();

const { app } = toRefs(props);

const textEditorStore = useTextEditorStore();
const { openedNode } = storeToRefs(textEditorStore);

let editorObj: monaco.editor.IEditor | undefined;
const isMobileOrTablet = useBreakpoints(breakpointsTailwind).smaller("lg");

onMounted(() => {
  if (isMobileOrTablet.value) return;

  editorObj = monaco.editor.create(document.getElementById("editor")!, {
    value: openedNode.value?.content || "",
    language: "javascript",
    theme: "vs-dark",
    automaticLayout: false,
  });

  watch(
    app,
    (newApp) => {
      if (!editorObj) return;
      editorObj.layout({
        width: newApp.width,
        height: newApp.height - 40, // 40px the height of the topbar
      });
    },
    { deep: true, immediate: true },
  );
});

onUnmounted(() => {
  editorObj?.dispose();
});
</script>

<template>
  <div v-if="!isMobileOrTablet" id="editor" />
  <div v-else class="grid h-full w-full place-content-center bg-background p-8">
    <div class="flex flex-col items-center gap-6">
      <Icon name="gnome:warning" size="140" class="text-muted-foreground" />
      <p class="text-center">
        {{ $t("kate_not_available_on_mobile") }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
