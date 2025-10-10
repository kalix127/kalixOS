<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
import { useDraggable, useWindowSize } from "@vueuse/core";

const el = ref<HTMLElement | null>(null);

const isDisabled = ref(false);
const isExpanded = ref(false);

const { width } = useWindowSize();

const { x, style } = useDraggable(el, {
  containerElement: document.querySelector("body"),
  initialValue: { x: 10, y: 180 },
  disabled: isDisabled,
  preventDefault: true,
});

const expandDirection = computed(() => {
  if (x.value > width.value / 2) {
    return "right";
  }
  return "left";
});

function handleOpen() {
  isExpanded.value = !isExpanded.value;
  isDisabled.value = true;
}

function handleClose() {
  isExpanded.value = false;
  isDisabled.value = false;
}

const { t } = useI18n();
const { githubUrl, linkedinUrl, repositoryUrl, twitterUrl, redditUrl }
  = useRuntimeConfig().public;

const socialLinks = [
  {
    name: t("github_repository"),
    icon: "gnome:branch",
    url: repositoryUrl,
  },
  {
    name: t("my_github_profile"),
    icon: "logo:github",
    url: githubUrl,
  },
  {
    name: t("my_linkedin_profile"),
    icon: "logo:linkedin",
    url: linkedinUrl,
  },
  {
    name: t("my_twitter_profile"),
    icon: "logo:twitter",
    url: twitterUrl,
  },
  {
    name: t("my_reddit_profile"),
    icon: "logo:reddit",
    url: redditUrl,
  },
];
</script>

<template>
  <div ref="el" :style="style" class="fixed z-[100000] grid size-[50px] cursor-move select-none place-items-center rounded-full">
    <!-- Trigger -->
    <template v-if="!isExpanded">
      <img src="/img/avatar.png" style="touch-action:none;" class="rounded-full border border-background" alt="Gianluca Iavicoli" width="60" height="60">

      <button class="share-button absolute -bottom-2 -right-1 z-10 grid place-items-center rounded-full bg-background p-1 hover:ring-2 hover:ring-primary/75" @click="handleOpen">
        <Icon
          name="gnome:share"
          size="20"
          class="text-foreground"
        />
      </button>
    </template>

    <!-- Content -->
    <Transition>
      <div
        v-if="isExpanded"
        v-on-click-outside="handleClose"
        class="absolute top-0 z-10 flex cursor-auto flex-col justify-between gap-4 rounded-lg bg-background p-3"
        :class="[
          expandDirection === 'left' ? 'left-0 origin-top-left' : 'right-0 origin-top-right',
          isExpanded ? 'h-fit w-32' : 'size-0 opacity-0',
        ]"
      >
        <!-- Close button -->
        <button class="absolute right-1 top-1" @click="handleClose">
          <Icon name="gnome:close" size="22" class="transition-colors duration-200 hover:text-muted-foreground" />
        </button>

        <div class="grid grid-cols-2 gap-2">
          <TooltipProvider
            v-for="social in socialLinks"
            :key="social.name"
            :delay-duration="100"
          >
            <Tooltip>
              <TooltipTrigger
                :default-open="false"
                as-child
              >
                <NuxtLink
                  :to="social.url"
                  :external="true"
                  :title="social.name"
                  target="_blank"
                  class="grid place-content-center first:col-span-2"
                >
                  <Icon
                    class="rounded-[calc(var(--radius)+0.5px)]"
                    :name="social.icon"
                    size="30"
                    mode="svg"
                  />
                </NuxtLink>
              </TooltipTrigger>
              <TooltipContent
                :side-offset="6"
                class="z-[100000] w-fit rounded-lg text-sm font-medium"
              >
                <p>{{ social.name }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from[class*="origin-top-left"],
.v-leave-to[class*="origin-top-left"] {
  transform: scale(0);
  transform-origin: top left;
  opacity: 0;
}

.v-enter-from[class*="origin-top-right"],
.v-leave-to[class*="origin-top-right"] {
  transform: scale(0);
  transform-origin: top right;
  opacity: 0;
}

.v-enter-to,
.v-leave-from {
  transform: scale(1);
  opacity: 1;
}

.share-button {
  animation-duration: 4000ms;
}
</style>
