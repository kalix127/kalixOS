<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import type * as Monaco from "monaco-editor";
import type { AppNode } from "@/types";
import { watchThrottled } from "@vueuse/core";
import { monacoEditorLanguageMap, monacoTheme } from "@/constants";

defineProps<{
  class?: HTMLAttributes["class"];
}>();

defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "fullscreen"): void;
}>();

const app = inject("app") as Ref<AppNode>;
const localHeight = inject("localHeight") as Ref<number>;
const localWidth = inject("localWidth") as Ref<number>;

const textEditorStore = useKateStore();
const { openedNode } = storeToRefs(textEditorStore);
const { updateApp } = useDesktopStore();

let monaco: typeof import("monaco-editor") | null = null;
let editorObj: Monaco.editor.IEditor | undefined;
let editorModel: Monaco.editor.ITextModel | null = null;

function getLanguage(name: string | undefined): string {
  if (!name)
    return "plaintext";
  const extension = name.split(".").pop();
  const language = monacoEditorLanguageMap[extension ?? ""] || "plaintext";
  return language;
}

onMounted(async () => {
  monaco = await import("monaco-editor");
  await import("@/assets/js/monacoWorker");

  if (!monaco)
    return;

  // @ts-ignore
  monaco.editor.defineTheme("github-custom", monacoTheme);

  editorObj = monaco.editor.create(document.getElementById("editor")!, {
    "value": openedNode.value?.content || "",
    "language": getLanguage(openedNode.value?.name),
    "theme": "github-custom",
    "automaticLayout": false,
    "semanticHighlighting.enabled": true,
    "tabSize": 2,
    "wordWrap": "on",
  });

  // Update the content
  editorModel = editorObj.getModel() as Monaco.editor.ITextModel;
  editorModel.onDidChangeContent(() => {
    if (!openedNode.value)
      return;
    const content = editorModel?.getValue() || "";
    openedNode.value.content = content;
  });

  // Update the size of monaco
  watchThrottled(
    [localHeight, localWidth],
    ([newHeight, newWidth]: [number, number]) => {
      if (!editorObj)
        return;

      editorObj.layout({
        width: newWidth,
        height: newHeight - 40, // 40px the height of the topbar
      });
    },
    { throttle: 10, deep: true, immediate: true },
  );

  // Update the language based on node's extension
  watch(
    openedNode,
    (newOpenedNode) => {
      if (!monaco || !editorModel)
        return;

      const language = getLanguage(newOpenedNode?.name);
      monaco.editor.setModelLanguage(editorModel, language);

      // Update the App's title
      if (app.value.title !== newOpenedNode?.name) {
        updateApp(app.value.id, { title: newOpenedNode?.name });
      }

      // Update the editor's text value when the user open another file
      if (editorModel.getValue() !== newOpenedNode?.content) {
        editorModel.setValue(newOpenedNode?.content || "");
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
  <div class="grid size-full grid-rows-[40px_1fr]">
    <!-- Top bar -->
    <DesktopWindowTopBar
      @minimize="() => $emit('minimize')"
      @fullscreen="() => $emit('fullscreen')"
      @close="() => $emit('close')"
    />

    <!-- Kate -->
    <div id="editor" />
  </div>
</template>

<style>
.monaco-editor {
  @apply duration-300;
}
</style>
