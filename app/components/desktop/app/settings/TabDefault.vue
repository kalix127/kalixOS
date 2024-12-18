<script setup lang="ts"></script>

<template>
  <SettingsContent>
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <div class="grid place-content-center">
        <div class="flex flex-col items-center gap-4 text-center">
          <Icon
            name="gnome:sidebar"
            size="120"
            class="text-muted-foreground"
          />

          <p class="text-sm text-muted-foreground">
            {{ $t("navigate_settings") }}
          </p>
        </div>
      </div>
    </div>
  </SettingsContent>
</template>

<style scoped></style>
