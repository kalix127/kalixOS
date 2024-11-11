<script setup lang="ts">
import type { AppNode, WifiNetwork } from "@/types";

const props = defineProps<{
  app: AppNode;
  network: WifiNetwork;
}>();

const { app, network } = toRefs(props);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { forgetConnection } = useWifi();

function handleForgetConnection() {
  forgetConnection(network.value);
  emit("close");
}
</script>

<template>
  <DesktopAppModal :app="app">
    <!-- Topbar -->
    <div class="app-topbar flex h-12 p-2 sm:min-w-80 z-10">
      <!-- Cancel button -->
      <div class="flex flex-1 items-center">
        <Button
          variant="secondary"
          class="h-full cursor-default bg-muted font-extrabold"
          @click="emit('close')"
        >
          {{ $t("close") }}
        </Button>
      </div>

      <!-- Title -->
      <div class="hidden flex-none items-center justify-center sm:flex">
        <span class="text-sm font-extrabold">{{ network.name }}</span>
      </div>

      <!-- Empty div -->
      <div class="hidden flex-1 items-center justify-end gap-2 sm:flex"></div>
    </div>

    <!-- Content -->
    <div
      class="flex h-[calc(100%-40px)] w-full flex-col justify-center gap-4 px-3 py-4"
    >
      <span class="block font-medium sm:hidden text-center">{{ network.name }}</span>
      <div class="flex flex-col items-center gap-3 sm:gap-2">
        <div
          v-for="(detail, key) in network.details"
          :key="key"
          class="grid grid-cols-1 text-wrap text-sm sm:grid-cols-2 sm:gap-4"
        >
          <span class="text-center font-medium sm:text-end">{{ $t(key) }}</span>
          <span
            class="break-all text-center font-medium text-muted-foreground sm:text-start"
            >{{ Array.isArray(detail) ? detail.join(" / ") : detail }}</span
          >
        </div>
      </div>

      <!-- Forget connection -->
      <div class="flex justify-center">
        <Button
          @click="handleForgetConnection"
          class="max-w-fit rounded-full"
          variant="destructive"
        >
          {{ $t("forget_connection") }}...
        </Button>
      </div>
    </div>
  </DesktopAppModal>
</template>

<style scoped></style>
