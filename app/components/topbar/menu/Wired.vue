<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";

const globalStore = useGlobalStore();
const { isWiredMenuOpen, isWiredEnabled } = storeToRefs(globalStore);

function closeMenu() {
  isWiredMenuOpen.value = false;
}

function handleDisconnect() {
  isWiredEnabled.value = false;
  isWiredMenuOpen.value = false;
}
</script>

<template>
  <TopbarMenu
    v-on-click-outside="closeMenu"
    :is-open="isWiredMenuOpen"
    :is-enabled="isWiredEnabled"
    :title="$t('wired_connection')"
    icon="gnome:wired-on"
  >
    <Button
      variant="ghost"
      class="flex w-full items-center justify-between rounded-xl font-medium duration-0 hover:bg-accent"
      @click="handleDisconnect"
    >
      <div class="flex items-center gap-2">
        <Icon
          name="gnome:wired-on"
          size="18"
        />
        <span>{{ $t("wired") }}</span>
      </div>
      <span class="text-muted-foreground"> {{ $t("disconnect") }} </span>
    </Button>
  </TopbarMenu>
</template>

<style scoped></style>
