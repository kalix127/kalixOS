<script setup lang="ts">
import type { AppNode } from "@/types";

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const { username } = storeToRefs(useGlobalStore());

const deviceName = computed(() => {
  return `${username.value}-desktop`.toLowerCase();
});
</script>

<template>
  <DesktopAppSettingsContent :app="app">
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <!-- Device Name -->
      <DesktopAppSettingsOption>
        <template #label>
          <div class="flex flex-col items-start gap-0.5">
            <span class="text-xs text-muted-foreground">
              {{ $t("device_name") }}
            </span>
            <span>
              {{ deviceName }}
            </span>
          </div>
        </template>
      </DesktopAppSettingsOption>

      <!-- System Details -->
      <DesktopAppSettingsOptionGroup>
        <!-- Operating System -->
        <DesktopAppSettingsOption :label="$t('operating_system')" is-first>
          <template #action>
            <span class="text-muted-foreground"> Manjaro Linux </span>
          </template>
        </DesktopAppSettingsOption>

        <!-- Processor -->
        <DesktopAppSettingsOption :label="$t('processor')">
          <template #action>
            <span class="text-muted-foreground">
              AMD Ryzen&trade; 9 5900X
            </span>
          </template>
        </DesktopAppSettingsOption>

        <!-- Memory -->
        <DesktopAppSettingsOption :label="$t('memory')">
          <template #action>
            <span class="text-muted-foreground"> 32.0 GiB </span>
          </template>
        </DesktopAppSettingsOption>

        <!-- Disk Capacity -->
        <DesktopAppSettingsOption :label="$t('disk_capacity')">
          <template #action>
            <span class="text-muted-foreground">
              {{ $t("unknown") }}
            </span>
          </template>
        </DesktopAppSettingsOption>

        <!-- Windowing System -->
        <DesktopAppSettingsOption :label="$t('windowing_system')" is-last>
          <template #action>
            <span class="text-muted-foreground"> Wayland </span>
          </template>
        </DesktopAppSettingsOption>
      </DesktopAppSettingsOptionGroup>
    </div>
  </DesktopAppSettingsContent>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
