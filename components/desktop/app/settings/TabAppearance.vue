<script setup lang="ts">
import type { AppNode } from "@/types";

const props = defineProps<{
  app: AppNode;
}>();

const { app } = toRefs(props);

const desktopStore = useDesktopStore();
const { backgroundImages, backgroundImage } = storeToRefs(desktopStore);
const { setBackgroundImage, deleteBackgroundImage } = desktopStore;

function checkBackgroundImage(file: File): boolean {
  // Check if file is an image
  if (!file.type.startsWith("image/")) {
    return false;
  }

  // Check if file size is less than 5MB
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return false;
  }

  return true;
}

const handleBackgroundChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];

  if (!file) return;
  if (!checkBackgroundImage(file)) return;

  const imageUrl = URL.createObjectURL(file);
  setBackgroundImage({ url: imageUrl, name: file.name });
};
</script>

<template>
  <DesktopAppSettingsContent :app="app">
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <!-- Dim screen -->
      <DesktopAppSettingsOption class="hover:bg-popover" is-first>
        <template #title>
          <div class="mb-1 flex items-center justify-between gap-2">
            <span class="text-sm font-extrabold tracking-wide">{{
              $t("background")
            }}</span>
            <label
              class="flex items-center gap-1 rounded-md p-2 text-sm font-extrabold transition-colors duration-100 hover:bg-popover/60"
            >
              <Icon name="gnome:add" size="20" />
              <span> {{ $t("add_picture") }}... </span>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @input="handleBackgroundChange"
              />
            </label>
          </div>
        </template>

        <template #center>
          <div class="flex h-fit w-full flex-wrap items-center gap-4">
            <TransitionGroup>
              <div
                v-for="(image, index) in backgroundImages"
                :key="image.name"
                class="place-items-cente relative grid"
                @click="() => setBackgroundImage(image)"
              >
                <LazyNuxtImg
                  class="h-28 w-36 rounded-md"
                  :src="image.url"
                  :alt="image.name"
                />

                <!-- Delete button -->
                <button
                  class="absolute right-2 top-2 grid place-content-center rounded-full bg-black/70 p-0.5"
                  @click.stop="() => deleteBackgroundImage(image.url)"
                  v-if="index !== 0"
                >
                  <Icon name="gnome:close" size="14" />
                </button>

                <!-- Selected indicator -->
                <div
                  class="absolute bottom-2 right-2 grid place-content-center rounded-full bg-primary p-0.5"
                  v-if="image.url === backgroundImage.url"
                >
                  <Icon name="gnome:checkmark" size="14" />
                </div>
              </div>
            </TransitionGroup>
          </div>
        </template>
      </DesktopAppSettingsOption>
    </div>
  </DesktopAppSettingsContent>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
