<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";

const { locale, setLocale, t } = useI18n();

const globalStore = useGlobalStore();
const { isLanguageMenuOpen } = storeToRefs(globalStore);

const items = computed(() => [
  {
    name: t("language.it"),
    value: "it-IT",
  },
  {
    name: t("language.en"),
    value: "en-US",
  },
]);

function closeMenu() {
  isLanguageMenuOpen.value = false;
}
</script>

<template>
  <TopbarMenu
    v-on-click-outside="closeMenu"
    :isOpen="isLanguageMenuOpen"
    :isEnabled="true"
    :title="$t('language.switch')"
    icon="gnome:languages"
  >
    <Button
      v-for="item in items"
      :key="item.name"
      variant="ghost"
      class="flex w-full cursor-default justify-start gap-2 rounded-xl font-medium duration-0"
      :class="[locale === item.value ? 'bg-accent' : 'hover:bg-accent/50']"
      @click="() => setLocale(item.value)"
    >
      {{ item.name }}
    </Button>
  </TopbarMenu>
</template>

<style scoped></style>
