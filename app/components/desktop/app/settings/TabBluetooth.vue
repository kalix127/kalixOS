<script setup lang="ts">
const globalStore = useGlobalStore();
const { isBluetoothEnabled } = storeToRefs(globalStore);
</script>

<template>
  <SettingsContent>
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <Transition mode="out-in">
        <!-- Bluetooth Disabled -->
        <div
          v-if="!isBluetoothEnabled"
          class="grid place-content-center"
        >
          <div class="flex flex-col items-center gap-4 text-center">
            <Icon
              name="gnome:bluetooth-off"
              size="120"
              class="text-muted-foreground"
            />
            <span class="text-2xl font-bold">{{
              $t("bluetooth_disabled")
            }}</span>
            <p class="text-sm text-muted-foreground">
              {{ $t("bluetooth_disabled_description") }}
            </p>
          </div>
        </div>

        <!-- Bluetooth Enabled -->
        <div
          v-else
          class="grid place-content-center"
        >
          <div class="flex flex-col items-center gap-4 text-center">
            <Icon
              name="gnome:bluetooth-on"
              size="120"
              class="text-muted-foreground"
            />
            <span class="text-2xl font-bold">{{
              $t("bluetooth_enabled")
            }}</span>
            <p class="text-sm text-muted-foreground">
              {{ $t("bluetooth_enabled_description") }}
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </SettingsContent>
</template>

<style scoped></style>
