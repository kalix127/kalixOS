<script setup lang="ts">
const { username } = storeToRefs(useGlobalStore());

const deviceName = computed(() => {
  return username.value.toLowerCase();
});
</script>

<template>
  <SettingsContent>
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <!-- Device Name -->
      <SettingsOption>
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
      </SettingsOption>

      <!-- System Details -->
      <SettingsOptionGroup>
        <!-- Operating System -->
        <SettingsOption
          :label="$t('operating_system')"
          is-first
        >
          <template #action>
            <span class="text-muted-foreground"> Manjaro Linux </span>
          </template>
        </SettingsOption>

        <!-- Processor -->
        <SettingsOption :label="$t('processor')">
          <template #action>
            <span class="text-muted-foreground">
              AMD Ryzen&trade; 9 5900X
            </span>
          </template>
        </SettingsOption>

        <!-- Memory -->
        <SettingsOption :label="$t('memory')">
          <template #action>
            <span class="text-muted-foreground"> 32.0 GiB </span>
          </template>
        </SettingsOption>

        <!-- Disk Capacity -->
        <SettingsOption :label="$t('disk_capacity')">
          <template #action>
            <span class="text-muted-foreground">
              {{ $t("unknown") }}
            </span>
          </template>
        </SettingsOption>

        <!-- Windowing System -->
        <SettingsOption
          :label="$t('windowing_system')"
          is-last
        >
          <template #action>
            <span class="text-muted-foreground"> Wayland </span>
          </template>
        </SettingsOption>
      </SettingsOptionGroup>
    </div>
  </SettingsContent>
</template>

<style scoped></style>
