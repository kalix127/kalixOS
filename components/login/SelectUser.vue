<script setup lang="ts">
import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();
const { loginView, username } = storeToRefs(globalStore);

function handleSelectUser() {
  username.value = "Gianluca";
  loginView.value = "enterPassword";
}

function handleNotListed() {
  loginView.value = "addUser";
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <button class="cursor-default" @click="handleSelectUser">
      <div
        class="flex min-h-14 min-w-72 items-center gap-4 rounded-xl bg-secondary p-1.5 hover:ring-2 hover:ring-primary"
      >
        <div class="grid place-content-center rounded-full bg-accent p-2">
          <Icon name="material-symbols:person" size="28" />
        </div>
        <span class="font-bold"> Gianluca </span>
      </div>
    </button>
    <Button
      @click="handleNotListed"
      variant="ghost"
      size="xs"
      class="w-fit cursor-default rounded-md p-2.5 duration-0 hover:bg-secondary"
    >
      <p class="select-none text-sm font-semibold">Not listed?</p>
    </Button>
  </div>
</template>

<style scoped></style>
