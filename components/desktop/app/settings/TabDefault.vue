<script setup lang="ts">
import type { AppNode } from "@/types";

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const globalStore = useGlobalStore();
const { isBluetoothEnabled } = storeToRefs(globalStore);
</script>

<template>
  <SettingsContent :app="app">
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <Transition mode="out-in">
        <div class="grid place-content-center">
          <div class="flex flex-col items-center gap-4 text-center">
            <Icon
              name="gnome:sidebar"
              size="120"
              class="text-muted-foreground"
            />

            <p class="text-sm text-muted-foreground">
              {{ $t("navigate_settings") }}
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </SettingsContent>
</template>

<style scoped></style>
