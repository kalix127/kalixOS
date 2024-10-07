<script setup lang="ts">
const options = [
  {
    name: "Suspend",
    handler: () => {
      console.log("Suspend");
    },
  },
  {
    name: "Restart...",
    handler: () => {
      console.log("Restart");
    },
  },
  {
    name: "Power off...",
    handler: () => {
      console.log("Power off");
    },
  },
  {
    name: "Log out...",
    handler: () => {
      console.log("Log out");
    },
  },
];
</script>

<template>
  <TopbarMenu label="poweroff">
    <template #icon>
      <Icon name="material-symbols:power-settings-new-rounded" size="24" />
    </template>
    <template #title> Power Off </template>
    <template #content>
      <!-- TODO: Maybe add spacing between the last button and its border top -->
      <Button
        v-for="option in options"
        :key="option.name"
        @click="option.handler"
        variant="ghost"
        class="w-full cursor-default justify-start rounded-xl font-medium duration-0 last:mt-2 last:rounded-none last:border-t last:border-t-gray-500 last:border-opacity-50 hover:bg-accent-light last:hover:rounded-xl"
        >{{ option.name }}</Button
      >
    </template>
  </TopbarMenu>
</template>

<style scoped></style>
