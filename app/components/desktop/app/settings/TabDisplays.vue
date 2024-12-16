<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
const { width, height } = useWindowSize();
</script>

<template>
  <SettingsContent>
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <SettingsOptionGroup>
        <!-- Displays -->
        <SettingsOption is-center is-first>
          <template #center>
            <div class="grid place-content-center p-2">
              <div
                class="grid h-20 w-32 place-content-center rounded-sm border border-t-8 border-gray-500/50 border-t-black bg-muted"
              >
                <span class="text-xs">{{ width }} x {{ height }}</span>
              </div>
            </div>
          </template>
        </SettingsOption>

        <!-- Primary Display -->
        <SettingsOption
          :label="$t('primary_display')"
          :description="$t('primary_display_description')"
          is-disabled
          is-last
        >
          <template #action>
            <Icon name="gnome:arrow-long-right" size="18" />
          </template>
        </SettingsOption>
      </SettingsOptionGroup>

      <!-- Toggle Night Light -->
      <SettingsOption :label="$t('night_light')" is-disabled>
        <template #action>
          <div class="flex items-center gap-2">
            <span>{{ $t("off") }}</span>
            <Icon name="gnome:arrow-long-right" size="18" />
          </div>
        </template>
      </SettingsOption>
    </div>
  </SettingsContent>
</template>

<style scoped></style>
