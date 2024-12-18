<script setup lang="ts"></script>

<template>
  <SettingsContent>
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <div class="flex flex-col items-center gap-4 text-center">
        <Icon
          name="gnome:printers"
          size="120"
          class="text-muted-foreground"
        />
        <span class="text-2xl font-extrabold">{{
          $t("no_print_service")
        }}</span>
        <p class="text-sm text-muted-foreground">
          {{ $t("no_print_service_description") }}
        </p>
      </div>
    </div>
  </SettingsContent>
</template>

<style scoped></style>
