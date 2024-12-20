<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";

const globalStore = useGlobalStore();
const { isUserFirstTime } = storeToRefs(globalStore);
const { setUserFirstTime } = globalStore;
const { repositoryUrl } = useRuntimeConfig().public;

const isOpen = ref(isUserFirstTime.value);

function handleClose() {
  setUserFirstTime(false);
  isOpen.value = false;
}
</script>

<template>
  <AlertDialog :open="isOpen">
    <AlertDialogContent class="max-w-72 rounded-xl xs:max-w-screen-xs md:max-w-screen-sm">
      <div v-on-click-outside="handleClose" class="space-y-4">
        <AlertDialogHeader class="space-y-1">
          <AlertDialogTitle class="text-left text-2xl md:text-center">
            {{ $t("welcome_title") }}
          </AlertDialogTitle>
          <AlertDialogDescription class="text-left text-base">
            <p>{{ $t("welcome_description") }}</p>
            <p>
              {{ $t("welcome_description_source_code") }}
              <NuxtLink
                :to="repositoryUrl"
                :external="true"
                target="_blank"
                class="text-foreground underline"
              >
                {{ $t("github_repository") }}
              </NuxtLink>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Button class="ml-auto flex items-center gap-2 text-base" @click="handleClose">
          {{ $t("get_started") }}
          <Icon name="gnome:arrow-long-right" size="16" />
        </Button>
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped></style>
