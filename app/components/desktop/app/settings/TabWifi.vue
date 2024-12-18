<script setup lang="ts">
const globalStore = useGlobalStore();
const {
  isWifiEnabled,
  isAirplaneModeEnabled,
  isSearchingWifiNetworks,
  availableWifiNetworks,
  connectedWifiNetwork,
} = storeToRefs(globalStore);
const { toggleWifi, toggleAirplaneMode } = globalStore;

const { connectToWifi, idConnectingNetwork } = useWifi();
</script>

<template>
  <SettingsContent>
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <SettingsOptionGroup>
        <!-- Toggle Wifi -->
        <SettingsOption
          :label="$t('wifi')"
          is-first
          @click="toggleWifi"
        >
          <template #action>
            <Switch :checked="isWifiEnabled" />
          </template>
        </SettingsOption>

        <!-- Saved Networks -->
        <SettingsOption
          :label="$t('saved_networks')"
          is-disabled
        >
          <template #action>
            <Icon
              name="gnome:arrow-long-right"
              size="18"
            />
          </template>
        </SettingsOption>

        <!-- Connect to Hidden Network -->
        <SettingsOption
          :label="$t('connect_to_hidden_network')"
          is-disabled
        >
          <template #action>
            <Icon
              name="gnome:arrow-long-right"
              size="18"
            />
          </template>
        </SettingsOption>

        <!-- Wifi Hotspot -->
        <SettingsOption
          :label="$t('turn_wifi_hotspot_on')"
          is-disabled
          is-last
        >
          <template #action>
            <Icon
              name="gnome:arrow-long-right"
              size="18"
            />
          </template>
        </SettingsOption>
      </SettingsOptionGroup>

      <!-- Toggle Airplane Mode -->
      <SettingsOption
        :label="$t('airplane_mode')"
        :description="$t('airplane_mode_description')"
        @click="toggleAirplaneMode"
      >
        <template #action>
          <Switch :checked="isAirplaneModeEnabled" />
        </template>
      </SettingsOption>

      <!-- Bottom Content -->
      <Transition mode="out-in">
        <!-- Network List -->
        <SettingsOptionGroup
          v-if="isWifiEnabled"
          :title="$t('visible_networks')"
        >
          <template #title-loading-icon>
            <Icon
              v-if="isSearchingWifiNetworks"
              name="extra:loading"
              class="animate-spin"
              size="16"
            />
          </template>
          <SettingsOption
            v-for="(network, index) in availableWifiNetworks"
            :key="network.id"
            :is-first="index === 0"
            :is-last="index === availableWifiNetworks.length - 1"
            @click="() => connectToWifi(network)"
          >
            <template #label>
              <div class="flex items-center gap-4">
                <IconWifi
                  :network="network"
                  :size="18"
                />
                <span>{{ network.name }}</span>
                <Icon
                  v-if="idConnectingNetwork === network.id"
                  name="extra:loading"
                  class="animate-spin"
                  size="16"
                />
              </div>
            </template>
            <template #action>
              <div class="flex items-center gap-4">
                <span
                  v-if="connectedWifiNetwork?.id === network.id"
                  class="text-muted-foreground"
                >{{ $t("connected") }}</span>
              </div>
            </template>
          </SettingsOption>
        </SettingsOptionGroup>

        <!-- Wifi Disabled -->
        <div
          v-else-if="!isWifiEnabled && !isAirplaneModeEnabled"
          class="!mt-10 grid place-content-center"
        >
          <div class="flex flex-col items-center gap-4 text-center">
            <Icon
              name="gnome:wifi-not-connected"
              size="140"
              class="text-muted-foreground"
            />
            <span class="text-2xl font-extrabold">{{
              $t("wifi_no_adapter_found")
            }}</span>
            <p class="text-sm text-muted-foreground">
              {{ $t("wifi_no_adapter_description") }}
            </p>
          </div>
        </div>

        <!-- Airplane Mode Enabled -->
        <div
          v-else-if="!isWifiEnabled && isAirplaneModeEnabled"
          class="!mt-10 grid place-content-center"
        >
          <div class="flex flex-col items-center gap-4 text-center">
            <Icon
              name="gnome:airplane-mode-on"
              size="140"
              class="text-muted-foreground"
            />
            <span class="text-2xl font-extrabold">{{
              $t("airplane_mode_enabled")
            }}</span>
            <p class="text-sm text-muted-foreground">
              {{ $t("airplane_mode_enabled_description") }}
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </SettingsContent>
</template>

<style scoped></style>
