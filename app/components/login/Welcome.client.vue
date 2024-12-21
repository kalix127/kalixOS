<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const globalStore = useGlobalStore();
const { isUserFirstTime } = storeToRefs(globalStore);
const { setUserFirstTime } = globalStore;
const { portfolioUrl, repositoryUrl } = useRuntimeConfig().public;

const isMobileOrTablet = useBreakpoints(breakpointsTailwind).smaller("lg");
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
          <AlertDialogTitle>
            <LinkPreview
              :url="portfolioUrl"
              class="text-left text-2xl text-foreground md:text-center"
            >
              {{ $t("welcome_title") }}
            </LinkPreview>
          </AlertDialogTitle>
          <AlertDialogDescription class="text-left text-base">
            <p>{{ $t("welcome_description") }}</p>
            <p>
              {{ $t("welcome_description_source_code") }}
              <LinkPreview
                :url="repositoryUrl"
                class="text-foreground underline"
              >
                {{ $t("github_repository") }}
              </LinkPreview>
            </p>
            <p v-if="isMobileOrTablet" class="mt-2">
              &#x26A0;  {{ $t("welcome_warning_mobile") }}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Button variant="outline" class="ml-auto flex items-center gap-2 text-base hover:bg-primary focus-visible:ring-0 focus-visible:ring-offset-0" @click="handleClose">
          {{ $t("get_started") }}
          <Icon name="gnome:arrow-long-right" size="16" />
        </Button>
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped></style>
