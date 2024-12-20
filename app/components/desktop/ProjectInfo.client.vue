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
    name: t("github_profile"),
    icon: "logo:github",
    url: githubUrl,
  },
  {
    name: t("linkedin_profile"),
    icon: "logo:linkedin",
    url: linkedinUrl,
  },
  {
    name: t("twitter_profile"),
    icon: "logo:twitter",
    url: twitterUrl,
  },
  {
    name: t("reddit_profile"),
    icon: "logo:reddit",
    url: redditUrl,
  },
];
</script>

<template>
  <div ref="el" :style="style" class="fixed z-[100000] grid size-[60px] cursor-move select-none place-items-center rounded-full">
    <!-- Trigger -->
    <template v-if="!isExpanded">
      <NuxtImg src="/img/avatar.png" style="touch-action:none;" class="rounded-full border border-background" alt="Gianluca Iavicoli" width="60" height="60" />

      <button class="absolute right-0 top-0 z-10 animate-bounce" @click="handleOpen">
        👋
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
          isExpanded ? 'h-fit w-[290px]' : 'size-0 opacity-0',
        ]"
      >
        <!-- Close button -->
        <button class="absolute right-2 top-2" @click="handleClose">
          <Icon name="gnome:close" size="22" class="transition-colors duration-200 hover:text-muted-foreground" />
        </button>

        <!--  -->
        <div class="flex flex-col gap-2">
          <span class="font-bold">{{ t("about_project") }}:</span>
          <p class="text-sm font-medium text-muted-foreground">
            {{ t("about_project_description") }}
          </p>
        </div>

        <!-- Quick links -->
        <div class="flex items-center justify-evenly">
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
                  class="grid place-content-center"
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
</style>
