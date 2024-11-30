<script lang="ts" setup>
import "@/assets/js/monacoWorker";
import * as monaco from "monaco-editor";
import type { HTMLAttributes } from "vue";
import type { AppNode } from "@/types";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  app: AppNode;
}>();

const { app } = toRefs(props);

const textEditorStore = useTextEditorStore();
const { openedNode } = storeToRefs(textEditorStore);

let editorObj: monaco.editor.IEditor | undefined;

onMounted(() => {
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
  <div id="editor" />
</template>

<style scoped></style>
