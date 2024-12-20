<script setup lang="ts">
definePageMeta({
  pageTransition: false,
});

const { t } = useI18n();
useHead({
  title: computed(() => t("seo.title.poweroff")),
  meta: [{ name: "description", content: t("seo.description.poweroff") }],
});

const { handlePowerUp } = useBootStore();
</script>

<template>
  <div class="grid h-full min-h-svh place-content-center bg-black">
    <div class="group relative inline-flex">
      <div
        class="group-active:duration-50 absolute -inset-px rounded-full bg-primary opacity-80 blur-lg transition duration-500 group-hover:opacity-90 group-active:-inset-1 group-active:opacity-100"
      />
      <button
        class="relative flex items-center justify-center rounded-full bg-popover p-7 transition duration-200"
        @click="handlePowerUp"
      >
        <Icon
          name="gnome:poweroff"
          size="72"
        />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
