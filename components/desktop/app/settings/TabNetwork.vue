<script setup lang="ts">
import type { AppNode } from "@/types";

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const globalStore = useGlobalStore();
const { isWiredEnabled } = storeToRefs(globalStore);
const { toggleWired } = globalStore;
</script>

<template>
  <DesktopAppSettingsContent :app="app">
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <!-- Toggle Wired -->
      <DesktopAppSettingsOption
        :title="$t('wired')"
        :label="`${isWiredEnabled ? $t('connected') : ''} 1,000 Mb/s`"
        @click="toggleWired"
      >
        <template #action>
          <Switch :checked="isWiredEnabled" />
        </template>
      </DesktopAppSettingsOption>

      <!-- VPN -->
      <DesktopAppSettingsOption
        title="VPN"
        :label="$t('not_set_up')"
        is-disabled
      >
      </DesktopAppSettingsOption>

      <!-- Proxy -->
      <DesktopAppSettingsOption title="Proxy" label="Proxy" is-disabled>
        <template #action>
          <Icon name="gnome:arrow-long-right" size="18" />
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
