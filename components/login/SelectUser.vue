<script setup lang="ts">
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
        class="flex min-h-16 min-w-72 items-center gap-4 rounded-xl bg-secondary/90 p-1.5 ring-2 ring-primary/70 hover:bg-secondary"
      >
        <div class="grid place-content-center rounded-full bg-accent p-3">
          <Icon name="gnome:avatar" size="28" />
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
      <p class="select-none text-sm font-semibold">
        {{ $t("not_listed") }}
      </p>
    </Button>
  </div>
</template>

<style scoped></style>
