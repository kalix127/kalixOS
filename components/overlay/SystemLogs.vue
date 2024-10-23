<script setup lang="ts">
import { useScroll } from "@vueuse/core";

const globalStore = useGlobalStore();
const { systemLogs } = storeToRefs(globalStore);

const systemLogsRef = ref<HTMLElement | null>(null);
const { y } = useScroll(systemLogsRef);

watch(
  systemLogs,
  async () => {
    if (!systemLogsRef.value) return;
    await nextTick();

    y.value = systemLogsRef.value?.offsetHeight + 100;
  },
  { deep: true },
);
</script>

<template>
  <div
    ref="systemLogsRef"
    class="hide-scrollbar absolute inset-0 hidden h-[100vh] w-[100vw] overflow-y-scroll bg-black sm:block"
  >
    <div class="flex flex-col items-start justify-end p-2">
      <div
        class="flex items-center justify-center gap-2 text-xs"
        v-for="log in systemLogs"
        :key="log.message"
      >
        <!-- Type -->
        <template v-if="log.action">
          <div class="w-20 select-none">
            <template v-if="log.ok">
              [<span class="px-5 font-extrabold text-green-500"> OK </span>]
            </template>
          </div>

          <!-- Action  -->
          <span class="font-extrabold text-muted-foreground">{{
            log.action
          }}</span>
        </template>

        <!-- Message -->
        <span>{{ log.message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
