<script lang="ts" setup>
const route = useRoute();
</script>

<template>
  <header
    class="flex items-center justify-between bg-[#080404] px-1"
    :class="[route.name === 'login' ? '!bg-transparent' : '']"
  >
    <!-- Left empty div for spacing -->
    <div class="hidden sm:block sm:w-1/3"></div>

    <!-- Calendar -->
    <TopbarCalendar />

    <!-- Main menu -->
    <div class="flex w-1/3 items-center justify-end gap-4">
      <TopbarResources />
      <TopbarSystemMenu />
    </div>
  </header>
</template>
