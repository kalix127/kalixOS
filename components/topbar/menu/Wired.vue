<script setup lang="ts">
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";
import { vOnClickOutside } from "@vueuse/components";

const globalStore = useGlobalStore();
const { isWiredMenuOpen } = storeToRefs(globalStore);

function closeMenu() {
  isWiredMenuOpen.value = false;
}
</script>

<template>
  <TopbarMenu
    v-on-click-outside="closeMenu"
    title="Wired Connections"
    icon="lucide:ethernet-port"
    label="wired"
  >
    <Button
      variant="ghost"
      class="flex w-full cursor-default items-center justify-between rounded-xl font-medium duration-0 hover:bg-accent"
    >
      <div class="flex items-center gap-2">
        <Icon name="lucide:ethernet-port" size="18" />
        <span>Wired</span>
      </div>
      <span class="text-muted-foreground"> Disconnect </span>
    </Button>
  </TopbarMenu>
</template>

<style scoped></style>
