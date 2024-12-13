<script setup lang="ts">
import type { AppNode } from "@/types";

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const { volume, inputVolume } = storeToRefs(useGlobalStore());
</script>

<template>
  <SettingsContent :app="app">
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <!-- Output -->
      <SettingsOptionGroup :title="$t('output')">
        <!-- Device -->
        <SettingsOption
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
        </SettingsOption>

        <!-- Volume -->
        <SettingsOption class="gap-6" :label="$t('output_volume')" is-last>
          <template #action>
            <div class="flex flex-grow items-center gap-4">
              <IconVolume :volume="volume[0]" :size="20" />
              <Slider
                v-model="volume"
                :default-value="volume"
                :min="0"
                :max="100"
                :step="1"
              />
            </div>
          </template>
        </SettingsOption>
      </SettingsOptionGroup>

      <!-- Input -->
      <SettingsOptionGroup :title="$t('input')">
        <!-- Device -->
        <SettingsOption
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
        </SettingsOption>

        <!-- Volume -->
        <SettingsOption class="gap-6" :label="$t('input_volume')" is-last>
          <template #action>
            <div class="flex flex-grow items-center gap-4">
              <IconMicrophone :value="inputVolume[0]" :size="20" />
              <Slider
                v-model="inputVolume"
                :default-value="inputVolume"
                :min="0"
                :max="100"
                :step="1"
              />
            </div>
          </template>
        </SettingsOption>
      </SettingsOptionGroup>

      <!-- Sound -->
      <SettingsOptionGroup :title="$t('sounds')">
        <!-- Volume levels -->
        <SettingsOption :label="$t('volume_levels')" is-disabled is-first>
          <template #action>
            <Icon name="gnome:arrow-long-right" size="18" />
          </template>
        </SettingsOption>

        <!-- Alert sounds -->
        <SettingsOption :label="$t('alert_sound')" is-disabled is-last>
          <template #action>
            <div class="flex items-center gap-2">
              <span>Click</span>
              <Icon name="gnome:arrow-long-right" size="18" />
            </div>
          </template>
        </SettingsOption>
      </SettingsOptionGroup>
    </div>
  </SettingsContent>
</template>

<style scoped></style>
