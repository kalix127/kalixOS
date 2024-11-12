<script setup lang="ts">
import type { WifiNetwork, AppNode } from "@/types";

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const isWifiModalOpen = ref(false);
const selectedWifiNetwork = ref<WifiNetwork | null>(null);

const globalStore = useGlobalStore();
const {
  isWifiEnabled,
  isAirplaneModeEnabled,
  isSearchingWifiNetworks,
  availableWifiNetworks,
  connectedWifiNetwork,
  isConnectingToWifi,
} = storeToRefs(globalStore);
const { toggleWifi, toggleAirplaneMode } = globalStore;

const { connectToWifi, idConnectingNetwork } = useWifi();

function toggleWifiModal(wifiNetwork: WifiNetwork) {
  isWifiModalOpen.value = true;
  selectedWifiNetwork.value = wifiNetwork;
}

function closeWifiModal() {
  isWifiModalOpen.value = false;
}
</script>

<template>
  <DesktopAppSettingsContent :app="app">
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <DesktopAppSettingsOptionGroup>
        <!-- Toggle Wifi -->
        <DesktopAppSettingsOption
          :label="$t('wifi')"
          is-first
          @click="toggleWifi"
        >
          <template #action>
            <Switch :checked="isWifiEnabled" />
          </template>
        </DesktopAppSettingsOption>

        <!-- Saved Networks -->
        <DesktopAppSettingsOption :label="$t('saved_networks')" is-disabled>
          <template #action>
            <Icon name="gnome:arrow-long-right" size="18" />
          </template>
        </DesktopAppSettingsOption>

        <!-- Connect to Hidden Network -->
        <DesktopAppSettingsOption
          :label="$t('connect_to_hidden_network')"
          is-disabled
        >
          <template #action>
            <Icon name="gnome:arrow-long-right" size="18" />
          </template>
        </DesktopAppSettingsOption>

        <!-- Wifi Hotspot -->
        <DesktopAppSettingsOption
          :label="$t('turn_wifi_hotspot_on')"
          is-disabled
          is-last
        >
          <template #action>
            <Icon name="gnome:arrow-long-right" size="18" />
          </template>
        </DesktopAppSettingsOption>
      </DesktopAppSettingsOptionGroup>

      <!-- Toggle Airplane Mode -->
      <DesktopAppSettingsOption
        :label="$t('airplane_mode')"
        :description="$t('airplane_mode_description')"
        @click="toggleAirplaneMode"
      >
        <template #action>
          <Switch :checked="isAirplaneModeEnabled" />
        </template>
      </DesktopAppSettingsOption>

      <!-- Bottom Content -->
      <Transition mode="out-in">
        <!-- Network List -->
        <DesktopAppSettingsOptionGroup
          :title="$t('visible_networks')"
          v-if="isWifiEnabled"
        >
          <template #title-loading-icon>
            <Icon
              v-if="isSearchingWifiNetworks"
              name="extra:loading"
              class="animate-spin"
              size="16"
            />
          </template>
          <DesktopAppSettingsOption
            v-for="(network, index) in availableWifiNetworks"
            :key="network.id"
            :is-first="index === 0"
            :is-last="index === availableWifiNetworks.length - 1"
            @click="() => connectToWifi(network)"
          >
            <template #label>
              <div class="flex items-center gap-4">
                <WifiIcon :network="network" :size="18" />
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
                  >{{ $t("connected") }}</span
                >

                <Button
                  v-if="network.isSaved"
                  class="size-8 hover:bg-secondary-hover"
                  variant="ghost"
                  size="icon"
                  @click.stop="() => toggleWifiModal(network)"
                >
                  <Icon
                    name="material-symbols:info-outline-rounded"
                    size="18"
                  />
                </Button>
              </div>
            </template>
          </DesktopAppSettingsOption>
        </DesktopAppSettingsOptionGroup>

        <!-- Wifi Disabled -->
        <div
          class="grid place-content-center"
          v-else-if="!isWifiEnabled && !isAirplaneModeEnabled"
        >
          <div class="flex flex-col items-center gap-4 text-center">
            <Icon
              name="gnome:wifi-not-connected"
              size="120"
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
          class="grid place-content-center"
          v-else-if="!isWifiEnabled && isAirplaneModeEnabled"
        >
          <div class="flex flex-col items-center gap-4 text-center">
            <Icon
              name="gnome:airplane-mode-on"
              size="120"
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
    <DesktopAppSettingsTabWifiModal
      v-if="isWifiModalOpen"
      :app="app"
      :network="selectedWifiNetwork"
      @close="closeWifiModal"
    />
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
