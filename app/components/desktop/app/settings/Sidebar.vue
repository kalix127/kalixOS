<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

defineProps<{
  class?: HTMLAttributes["class"];
}>();

const { t } = useI18n();
const setDraggable = inject("setDraggable") as (value: boolean) => void;

const globalStore = useGlobalStore();
const { currentSettingsTab } = storeToRefs(globalStore);
const { setSettingsTab } = globalStore;

const isSearchActive = ref(false);
const searchTerm = ref("");

const items = computed(() => [
  {
    id: "wifi",
    label: t("wifi"),
    icon: "gnome:wifi-4",
    description: t("tab_wifi_description"),
    translationKeys: [
      "wifi",
      "saved_networks",
      "connect_to_hidden_network",
      "turn_wifi_hotspot_on",
      "airplane_mode",
      "airplane_mode_description",
      "visible_networks",
      "connected",
    ],
  },
  {
    id: "network",
    label: t("network"),
    icon: "gnome:network",
    description: t("tab_network_description"),
    translationKeys: ["network", "wired", "connected", "not_set_up"],
  },
  {
    id: "bluetooth",
    label: t("bluetooth"),
    icon: "gnome:bluetooth-on",
    description: t("tab_bluetooth_description"),
    translationKeys: ["bluetooth", "bluetooth_disabled", "bluetooth_enabled"],
  },
  {
    isSeparator: true,
  },
  {
    id: "displays",
    label: t("displays"),
    icon: "gnome:displays",
    description: t("tab_displays_description"),
    translationKeys: ["displays", "primary_display", "night_light"],
  },
  {
    id: "sound",
    label: t("sound"),
    icon: "gnome:volume-3",
    description: t("tab_sound_description"),
    translationKeys: [
      "sound",
      "output_device",
      "output_volume",
      "input_device",
      "input_volume",
      "headphones",
      "microphone",
      "volume_levels",
      "alert_sound",
    ],
  },
  {
    id: "power",
    label: t("power"),
    icon: "gnome:power",
    description: t("tab_power_description"),
    translationKeys: [
      "power",
      "battery_level",
      "fully_charged",
      "power_saving",
      "dim_screen",
      "screen_blank",
      "general",
      "show_battery_percentage",
    ],
  },
  {
    isSeparator: true,
  },
  {
    id: "appearance",
    label: t("appearance"),
    icon: "gnome:appearance",
    description: t("tab_appearance_description"),
    translationKeys: ["appearance", "background", "add_picture"],
  },
  {
    id: "printers",
    label: t("printers"),
    icon: "gnome:printers",
    description: t("tab_printers_description"),
    translationKeys: ["printers", "no_print_service"],
  },
  {
    id: "system",
    label: t("system"),
    icon: "gnome:system-info",
    description: t("tab_system_description"),
    translationKeys: [
      "system",
      "operating_system",
      "processor",
      "memory",
      "disk_capacity",
      "windowing_system",
      "device_name",
    ],
  },
]);

const filteredItems = computed(() => {
  if (!searchTerm.value.trim()) {
    return [];
  }
  const term = searchTerm.value.toLowerCase();
  return items.value.filter((item) => {
    if (item.isSeparator)
      return false;

    const labelMatch = item.label?.toLowerCase().includes(term) ?? false;
    const descriptionMatch
      = item.description?.toLowerCase().includes(term) ?? false;

    const translationsMatch
      = item.translationKeys?.some((key) => {
        const translatedText = t(key)?.toLowerCase() ?? "";
        return translatedText.includes(term);
      }) ?? false;

    return labelMatch || descriptionMatch || translationsMatch;
  });
});

const displayItems = computed(() => {
  return searchTerm.value.trim() ? filteredItems.value : items.value;
});

function handleItemClick(id: string) {
  if (!id)
    return;
  setSettingsTab(id);
  searchTerm.value = "";
  isSearchActive.value = false;
}

function toggleSearch() {
  isSearchActive.value = !isSearchActive.value;
  searchTerm.value = "";
}
</script>

<template>
  <ScrollArea
    :class="
      cn(
        'border-r border-r-black/30 p-2 transition-colors duration-300',
        $props.class,
      )
    "
  >
    <!-- Top-Sidebar -->
    <div
      class="hidden sm:block"
      @mouseenter.stop="() => setDraggable(true)"
      @mouseleave.stop="() => setDraggable(false)"
    >
      <div class="flex h-10 items-center justify-between">
        <button
          class="grid place-content-center rounded-md p-2 transition-colors duration-300 hover:bg-popover"
          :class="{
            'bg-popover': isSearchActive,
          }"
          @click="() => toggleSearch()"
        >
          <Icon
            name="gnome:search"
            size="16"
          />
        </button>
        <div class="text-sm font-bold">
          {{ $t("settings") }}
        </div>
        <div class="grid place-content-center p-2">
          <Icon
            name="gnome:three-dots-vertical"
            size="18"
          />
        </div>
      </div>

      <!-- Search input -->
      <Collapsible :open="isSearchActive">
        <CollapsibleContent>
          <div class="relative mb-2 flex items-center gap-4 p-1">
            <Input
              v-model="searchTerm"
              v-focus
              :placeholder="$t('search_settings')"
              class="h-8 bg-popover pl-8 outline-none ring-2 ring-ring/70 ring-offset-0 focus-visible:ring-ring/70 focus-visible:ring-offset-0"
              type="text"
            />

            <!-- Search icon -->
            <button
              type="button"
              aria-label="Toggle password visibility"
              class="absolute inset-y-0 start-0 flex items-center justify-center px-3"
            >
              <Icon
                name="gnome:search"
                size="16"
                class="text-muted-foreground transition-colors duration-300 hover:text-foreground"
              />
            </button>

            <!-- Backspace icon -->
            <button
              type="button"
              aria-label="Toggle password visibility"
              class="absolute inset-y-0 end-0 flex items-center justify-center px-3"
              @click="() => (searchTerm = '')"
            >
              <Icon
                name="gnome:backspace"
                size="20"
                class="text-muted-foreground transition-colors duration-300 hover:text-foreground"
              />
            </button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>

    <!-- Sidebar -->
    <div class="flex flex-col gap-1.5">
      <template v-for="(item, index) in displayItems">
        <!-- Separator -->
        <div
          v-if="item.isSeparator"
          :key="item.label"
          class="h-px w-full bg-gray-500/25"
        />

        <!-- Item -->
        <button
          v-else
          :key="`${item.label}-${index}`"
          class="flex w-full items-center gap-3 rounded-md transition-colors duration-200"
          :class="[
            currentSettingsTab === item.id
              ? 'bg-popover'
              : 'hover:bg-popover/50',
            searchTerm ? 'h-fit p-2' : 'h-11 p-2',
          ]"
          @click="() => handleItemClick(item.id ?? '')"
        >
          <div
            v-if="item.icon"
            class="grid place-content-center"
          >
            <Icon
              :name="item.icon"
              size="16"
            />
          </div>
          <div class="flex flex-col items-start gap-1">
            <span class="text-sm font-medium">{{ item.label }}</span>
            <span
              v-if="searchTerm"
              class="text-left text-xs text-muted-foreground"
            >
              {{ item.description }}
            </span>
          </div>
        </button>
      </template>
    </div>
  </ScrollArea>
</template>

<style scoped></style>
