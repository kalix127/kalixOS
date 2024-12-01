<script lang="ts" setup>
import "@/assets/js/monacoWorker";
import * as monaco from "monaco-editor";
import type { HTMLAttributes } from "vue";
import type { AppNode } from "@/types";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { monacoEditorLanguageMap } from "@/constants";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  app: AppNode;
}>();

const { app } = toRefs(props);

const textEditorStore = useTextEditorStore();
const { openedNode } = storeToRefs(textEditorStore);
const { updateApp } = useDesktopStore();

let editorObj: monaco.editor.IEditor | undefined;

const isMobileOrTablet = useBreakpoints(breakpointsTailwind).smaller("lg");

const getLanguage = (name: string | undefined): string => {
  if (!name) return "plaintext";
  const extension = name.split(".").pop();
  const language = monacoEditorLanguageMap[extension ?? ""] || "plaintext";
  return language;
};

onMounted(() => {
  if (isMobileOrTablet.value) return;

  editorObj = monaco.editor.create(document.getElementById("editor")!, {
    value: openedNode.value?.content || "",
    language: getLanguage(openedNode.value?.name),
    theme: "vs-dark",
    automaticLayout: false,
  });

  // Update the content
  const model = editorObj.getModel() as monaco.editor.ITextModel;
  model.onDidChangeContent((e: any) => {
    if (!openedNode.value) return;
    const content = model.getValue();
    openedNode.value.content = content;
  });

  // Update the size of monaco
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

  // Update the language based on node's extension
  watch(
    openedNode,
    (newOpenedNode) => {
      const language = getLanguage(newOpenedNode?.name);
      // @ts-ignore
      monaco.editor.setModelLanguage(model, language);

      // Update the App's title
      if (app.value.title !== newOpenedNode?.name) {
        updateApp(app.value.id, { title: newOpenedNode?.name });
      }

      // Update the editor's text value when the user open another file
      if (model.getValue() !== newOpenedNode?.content) {
        model.setValue(newOpenedNode?.content || "");
      }
    },
    { deep: true, immediate: true },
  );
});

onUnmounted(() => {
  editorObj?.dispose();
  textEditorStore.$reset();
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
