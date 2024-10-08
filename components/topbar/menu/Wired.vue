<script setup lang="ts"></script>

<template>
  <TopbarMenu title="Wired" icon="lucide:ethernet-port" label="wired">
    <Button
      variant="ghost"
      class="flex w-full cursor-default items-center justify-between rounded-xl font-medium duration-0 last:mt-2 last:rounded-none last:border-t last:border-t-accent hover:bg-accent-light last:hover:rounded-xl"
    >
      <div class="flex items-center gap-2">
        <Icon name="lucide:ethernet-port" size="18" />
        <span>Wired</span>
      </div>
      <span class="text-gray-400"> Disconnect </span>
    </Button>
  </TopbarMenu>
</template>

<style scoped></style>
