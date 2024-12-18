<script setup lang="ts">
const globalStore = useGlobalStore();
const { isWiredEnabled } = storeToRefs(globalStore);
const { toggleWired } = globalStore;
</script>

<template>
  <SettingsContent>
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <!-- Toggle Wired -->
      <SettingsOption
        :title="$t('wired')"
        :label="`${isWiredEnabled ? $t('connected') : ''} 1,000 Mb/s`"
        @click="toggleWired"
      >
        <template #action>
          <Switch :checked="isWiredEnabled" />
        </template>
      </SettingsOption>

      <!-- VPN -->
      <SettingsOption
        title="VPN"
        :label="$t('not_set_up')"
        is-disabled
      />

      <!-- Proxy -->
      <SettingsOption
        title="Proxy"
        label="Proxy"
        is-disabled
      >
        <template #action>
          <Icon
            name="gnome:arrow-long-right"
            size="18"
          />
        </template>
      </SettingsOption>
    </div>
  </SettingsContent>
</template>

<style scoped></style>
