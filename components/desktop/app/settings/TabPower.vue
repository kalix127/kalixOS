<script setup lang="ts">
import type { AppNode } from "@/types";
import { defaultDimScreenThreshold } from "~/constants";

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const globalStore = useGlobalStore();
const {
  dimScreenThreshold,
  isShowBatteryPercentageEnabled,
  isDimScreenEnabled,
} = storeToRefs(globalStore);
const { updateApp } = useDesktopStore();

function toggleShowBatteryPercentage() {
  isShowBatteryPercentageEnabled.value = !isShowBatteryPercentageEnabled.value;
}

function toggleDimScreen() {
  isDimScreenEnabled.value = !isDimScreenEnabled.value;
}
</script>

<template>
  <SettingsContent :app="app">
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <!-- Battery level -->
      <SettingsOptionGroup class="group gap-0" :title="$t('battery_level')">
        <SettingsOption
          class="min-h-6 pb-0 pt-3 group-hover:bg-secondary/80"
          is-first
        >
          <template #center>
            <Slider
              class="h-2 bg-green-300"
              :default-value="[0]"
              :max="100"
              :step="1"
              :disabled="true"
            />
          </template>
        </SettingsOption>
        <SettingsOption
          class="group-hover:bg-secondary/80"
          :label="$t('fully_charged')"
          is-last
        >
          <template #action> 100 % </template>
        </SettingsOption>
      </SettingsOptionGroup>

      <!-- Power saving -->
      <SettingsOptionGroup :title="$t('power_saving')">
        <!-- Dim screen -->
        <SettingsOption
          :label="$t('dim_screen')"
          :description="$t('dim_screen_description')"
          is-first
          @click="toggleDimScreen"
        >
          <template #action>
            <Switch :checked="isDimScreenEnabled" />
          </template>
        </SettingsOption>

        <!-- Screen blank -->
        <SettingsOption
          :label="$t('screen_blank')"
          :description="$t('screen_blank_description')"
          is-last
        >
          <template #action>
            <Select
              v-model="dimScreenThreshold"
              :default-value="defaultDimScreenThreshold"
              @update:open="
                (value) => updateApp('settings', { isDropdownOpen: value })
              "
            >
              <SelectTrigger class="h-9 w-fit gap-2 bg-transparent ring-0">
                <SelectValue :placeholder="$t('never')" />
              </SelectTrigger>
              <SelectContent class="z-[100000]">
                <SelectGroup>
                  <SelectItem value="0">
                    {{ $t("never") }}
                  </SelectItem>
                  <SelectItem value="60000">
                    {{ $t("1_minute") }}
                  </SelectItem>
                  <SelectItem value="120000">
                    {{ $t("2_minutes") }}
                  </SelectItem>
                  <SelectItem value="180000">
                    {{ $t("3_minutes") }}
                  </SelectItem>
                  <SelectItem value="240000">
                    {{ $t("4_minutes") }}
                  </SelectItem>
                  <SelectItem value="300000">
                    {{ $t("5_minutes") }}
                  </SelectItem>
                  <SelectItem value="600000">
                    {{ $t("10_minutes") }}
                  </SelectItem>
                  <SelectItem value="900000">
                    {{ $t("15_minutes") }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </template>
        </SettingsOption>
      </SettingsOptionGroup>

      <!-- General -->
      <SettingsOption
        :title="$t('general')"
        :label="$t('show_battery_percentage')"
        :description="$t('show_battery_percentage_description')"
        @click="toggleShowBatteryPercentage"
      >
        <template #action>
          <Switch :checked="isShowBatteryPercentageEnabled" />
        </template>
      </SettingsOption>
    </div>
  </SettingsContent>
</template>

<style scoped></style>
