<script setup lang="ts">
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

function handleBackgroundChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];

  if (!file)
    return;
  if (!checkBackgroundImage(file))
    return;

  const imageUrl = URL.createObjectURL(file);
  setBackgroundImage({ url: imageUrl, name: file.name });
}
</script>

<template>
  <SettingsContent>
    <div class="h-full space-y-6 px-6 py-8 sm:px-12">
      <!-- Dim screen -->
      <SettingsOption
        class="hover:bg-popover"
        is-first
      >
        <template #title>
          <div class="mb-1 flex items-center justify-between gap-2">
            <span class="text-sm font-bold tracking-wide">{{
              $t("background")
            }}</span>
            <label
              class="flex items-center gap-1 rounded-md p-2 text-sm font-bold transition-colors duration-100 hover:bg-popover/60"
            >
              <Icon
                name="gnome:add"
                size="20"
              />
              <span> {{ $t("add_picture") }}... </span>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @input="handleBackgroundChange"
              >
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
                  v-if="index !== 0"
                  class="absolute right-2 top-2 grid place-content-center rounded-full bg-black/70 p-0.5"
                  @click.stop="() => deleteBackgroundImage(image.url)"
                >
                  <Icon
                    name="gnome:close"
                    size="14"
                  />
                </button>

                <!-- Selected indicator -->
                <div
                  v-if="image.url === backgroundImage.url"
                  class="absolute bottom-2 right-2 grid place-content-center rounded-full bg-primary p-0.5"
                >
                  <Icon
                    name="gnome:checkmark"
                    size="14"
                  />
                </div>
              </div>
            </TransitionGroup>
          </div>
        </template>
      </SettingsOption>
    </div>
  </SettingsContent>
</template>

<style scoped></style>
