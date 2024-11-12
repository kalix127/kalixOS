<script setup lang="ts">
import type { AppNode } from "@/types";

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const { volume, inputVolume } = storeToRefs(useGlobalStore());
</script>

<template>
  <DesktopAppSettingsContent :app="app">
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <!-- Output -->
      <DesktopAppSettingsOptionGroup :title="$t('output')">
        <!-- Device -->
        <DesktopAppSettingsOption
          class="group gap-6"
          :label="$t('output_device')"
          is-first
        >
          <template #action>
            <div
              class="flex h-8 flex-grow items-center gap-4 rounded-md bg-secondary px-2 transition-colors group-hover:bg-secondary-hover"
            >
              <Icon name="gnome:headphones" size="18" />
              <span class="text-xs sm:text-sm">
                {{ $t("headphones") }}
              </span>
            </div>
          </template>
        </DesktopAppSettingsOption>

        <!-- Volume -->
        <DesktopAppSettingsOption
          class="gap-6"
          :label="$t('output_volume')"
          is-last
        >
          <template #action>
            <div class="flex flex-grow items-center gap-4">
              <Icon v-show="volume[0] > 66" name="gnome:volume-3" size="20" />
              <Icon
                v-show="volume[0] > 33 && volume[0] <= 66"
                name="gnome:volume-2"
                size="20"
              />
              <Icon
                v-show="volume[0] > 0 && volume[0] <= 33"
                name="gnome:volume-1"
                size="20"
              />
              <Icon
                v-show="volume[0] === 0"
                name="gnome:volume-off"
                size="20"
              />
              <Slider
                v-model="volume"
                :default-value="volume"
                :min="0"
                :max="100"
                :step="1"
              />
            </div>
          </template>
        </DesktopAppSettingsOption>
      </DesktopAppSettingsOptionGroup>

      <!-- Input -->
      <DesktopAppSettingsOptionGroup :title="$t('input')">
        <!-- Device -->
        <DesktopAppSettingsOption
          class="group gap-6"
          :label="$t('input_device')"
          is-first
        >
          <template #action>
            <div
              class="flex h-8 flex-grow items-center gap-4 rounded-md bg-secondary px-2 transition-colors group-hover:bg-secondary-hover"
            >
              <Icon name="gnome:microphone-2" size="18" />
              <span class="text-xs sm:text-sm">
                {{ $t("microphone") }}
              </span>
            </div>
          </template>
        </DesktopAppSettingsOption>

        <!-- Volume -->
        <DesktopAppSettingsOption
          class="gap-6"
          :label="$t('input_volume')"
          is-last
        >
          <template #action>
            <div class="flex flex-grow items-center gap-4">
              <Icon
                v-show="inputVolume[0] > 50"
                name="gnome:microphone-2"
                size="20"
              />
              <Icon
                v-show="inputVolume[0] <= 50 && inputVolume[0] > 0"
                name="gnome:microphone-1"
                size="20"
              />
              <Icon
                v-show="inputVolume[0] === 0"
                name="gnome:microphone-off"
                size="20"
              />
              <Slider
                v-model="inputVolume"
                :default-value="inputVolume"
                :min="0"
                :max="100"
                :step="1"
              />
            </div>
          </template>
        </DesktopAppSettingsOption>
      </DesktopAppSettingsOptionGroup>

      <!-- Sound -->
      <DesktopAppSettingsOptionGroup :title="$t('sounds')">
        <!-- Volume levels -->
        <DesktopAppSettingsOption
          :label="$t('volume_levels')"
          is-disabled
          is-first
        >
          <template #action>
            <Icon name="gnome:arrow-long-right" size="18" />
          </template>
        </DesktopAppSettingsOption>

        <!-- Alert sounds -->
        <DesktopAppSettingsOption
          :label="$t('alert_sound')"
          is-disabled
          is-last
        >
          <template #action>
            <div class="flex items-center gap-2">
              <span>Click</span>
              <Icon name="gnome:arrow-long-right" size="18" />
            </div>
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
