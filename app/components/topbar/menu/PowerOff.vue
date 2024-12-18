<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";

const { t } = useI18n();

const globalStore = useGlobalStore();
const { isPowerOffMenuOpen, isAuthenticated } = storeToRefs(globalStore);

const { isRestartModalOpen, isPowerOffModalOpen, isLogoutModalOpen }
  = storeToRefs(useBootStore());

const { handleSuspend } = globalStore;

const options = computed(() => [
  {
    name: t("suspend"),
    handler: handleSuspend,
  },
  {
    name: `${t("restart")}...`,
    handler: () => {
      isRestartModalOpen.value = true;
    },
  },
  {
    name: `${t("power_off")}...`,
    handler: () => {
      isPowerOffModalOpen.value = true;
    },
  },
]);

function handleLogout() {
  isLogoutModalOpen.value = true;
}

function closeMenu() {
  isPowerOffMenuOpen.value = false;
}
</script>

<template>
  <TopbarMenu
    v-on-click-outside="closeMenu"
    :is-open="isPowerOffMenuOpen"
    :title="$t('power_off')"
    icon="gnome:poweroff"
  >
    <Button
      v-for="option in options"
      :key="option.name"
      variant="ghost"
      class="w-full justify-start rounded-xl font-medium duration-0 hover:bg-accent"
      @click="option.handler"
    >
      {{ option.name }}
    </Button>
    <template v-if="isAuthenticated">
      <!-- Separator -->
      <div class="h-1 border-t border-gray-500/40 px-2" />
      <Button
        variant="ghost"
        class="w-full justify-start rounded-xl font-medium duration-0 hover:bg-accent"
        @click="handleLogout"
      >
        {{ $t("logout") }}...
      </Button>
    </template>
  </TopbarMenu>
</template>

<style scoped></style>
