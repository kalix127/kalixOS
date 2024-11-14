<script setup lang="ts">
import type { AppNode } from "@/types";
import { useWindowSize } from "@vueuse/core";

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const { width, height } = useWindowSize();
</script>

<template>
  <DesktopAppSettingsContent :app="app">
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <DesktopAppSettingsOptionGroup>
        <!-- Displays -->
        <DesktopAppSettingsOption is-center is-first>
          <template #center>
            <div class="grid place-content-center p-2">
              <div
                class="grid h-20 w-32 place-content-center rounded-sm border border-t-8 border-gray-500/50 border-t-black bg-muted"
              >
                <span class="text-xs">{{ width }} x {{ height }}</span>
              </div>
            </div>
          </template>
        </DesktopAppSettingsOption>

        <!-- Primary Display -->
        <DesktopAppSettingsOption
          :label="$t('primary_display')"
          :description="$t('primary_display_description')"
          is-disabled
          is-last
        >
          <template #action>
            <Icon name="gnome:arrow-long-right" size="18" />
          </template>
        </DesktopAppSettingsOption>
      </DesktopAppSettingsOptionGroup>

      <!-- Toggle Night Light -->
      <DesktopAppSettingsOption :label="$t('night_light')" is-disabled>
        <template #action>
          <div class="flex items-center gap-2">
            <span>{{ $t("off") }}</span>
            <Icon name="gnome:arrow-long-right" size="18" />
          </div>
        </template>
      </DesktopAppSettingsOption>
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
