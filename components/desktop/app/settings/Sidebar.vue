<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const props = defineProps<{
  height: number;
}>();

const { height: windowHeight } = toRefs(props);
const { t } = useI18n();
const isMobile = useBreakpoints(breakpointsTailwind).smaller("sm");

const globalStore = useGlobalStore();
const { currentSettingsTab } = storeToRefs(globalStore);
const { setSettingsTab } = globalStore;

const scrollAreaHeight = computed(() => {
  const topBarHeight = 40;
  const windowContentHeight = windowHeight.value - topBarHeight;
  return windowContentHeight;
});

const items = computed(() => [
  {
    id: "wifi",
    label: t("wifi"),
    icon: "gnome:wifi-4",
  },
  {
    id: "network",
    label: t("network"),
    icon: "gnome:network",
  },
  {
    id: "bluetooth",
    label: t("bluetooth"),
    icon: "gnome:bluetooth-on",
  },
  {
    isSeparator: true,
  },
  {
    id: "displays",
    label: t("displays"),
    icon: "gnome:displays",
  },
  {
    id: "sound",
    label: t("sound"),
    icon: "gnome:volume-3",
  },
  {
    id: "power",
    label: t("power"),
    icon: "gnome:power",
  },
  {
    isSeparator: true,
  },
  {
    id: "appearance",
    label: t("appearance"),
    icon: "gnome:appearance",
  },
  {
    id: "printers",
    label: t("printers"),
    icon: "gnome:printers",
  },
  {
    id: "system",
    label: t("system"),
    icon: "gnome:system-info",
  },
]);
</script>

<template>
  <ScrollArea
    class="w-full rounded-l-md bg-muted p-1.5"
    :class="[isMobile ? '' : 'border-r border-r-black/30']"
    :style="{
      height: `${scrollAreaHeight}px`,
    }"
  >
    <div class="flex flex-col gap-1.5">
      <template v-for="(item, index) in items">
        <!-- Separator -->
        <div
          :key="item.label"
          v-if="item.isSeparator"
          class="h-px w-full bg-gray-500/25"
        ></div>

        <!-- Item -->
        <button
          v-else
          :key="`${item.label}-${index}`"
          class="flex h-11 w-full cursor-default items-center gap-3 rounded-md p-3 transition-colors duration-200"
          :class="[
            currentSettingsTab === item.id
              ? 'bg-popover'
              : 'hover:bg-popover/50',
          ]"
          @click="() => setSettingsTab(item.id)"
        >
          <div v-if="item.icon" class="grid place-content-center">
            <Icon :name="item.icon" size="16" />
          </div>
          <span class="text-sm font-medium">{{ item.label }}</span>
        </button>
      </template>
    </div>
  </ScrollArea>
</template>

<style scoped></style>
