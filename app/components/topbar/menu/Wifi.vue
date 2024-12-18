<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";

const { isWifiMenuOpen, isWifiEnabled }
  = storeToRefs(useGlobalStore());

const {
  availableWifiNetworks,
  connectedWifiNetwork,
  isSearchingWifiNetworks,
  idConnectingNetwork,
  connectToWifi,
} = useWifi();

function closeMenu() {
  isWifiMenuOpen.value = false;
}
</script>

<template>
  <TopbarMenu
    v-on-click-outside="closeMenu"
    :is-open="isWifiMenuOpen"
    :is-enabled="isWifiEnabled"
    :title="$t('wifi')"
    icon="gnome:wifi-4"
  >
    <template #loading-icon>
      <Icon
        v-if="isSearchingWifiNetworks"
        name="extra:loading"
        class="animate-spin"
        size="20"
      />
    </template>

    <ScrollArea class="h-[100px] w-full pr-1 sm:h-[200px] lg:h-[300px]">
      <Button
        v-for="network in availableWifiNetworks"
        :key="network.id"
        variant="ghost"
        class="flex w-full cursor-pointer justify-start gap-2 rounded-xl font-medium transition-colors duration-200 hover:bg-accent"
        @click="() => connectToWifi(network)"
      >
        <IconWifi
          :network="network"
          :size="18"
        />
        <span>{{ network.name }}</span>

        <Icon
          v-if="connectedWifiNetwork?.id === network.id"
          name="gnome:checkmark"
          size="18"
        />
        <Icon
          v-if="idConnectingNetwork === network.id"
          name="extra:loading"
          class="animate-spin"
          size="18"
        />
      </Button>
    </ScrollArea>
  </TopbarMenu>
</template>

<style scoped></style>
