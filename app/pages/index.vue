<script setup lang="ts">
const { t } = useI18n();
useHead({
  title: computed(() => t("seo.title.index")),
  meta: [{ name: "description", content: t("seo.description.index") }],
});
</script>

<template>
  <main class="h-svh bg-black" />
</template>

<style scoped></style>
