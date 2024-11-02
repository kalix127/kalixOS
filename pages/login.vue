<script lang="ts" setup>
import { desktopEnvironments } from "@/constants";

definePageMeta({
  layout: "login",
  middleware: "desktop"
});

const globalStore = useGlobalStore();
const { loginView, desktopEnvironment } = storeToRefs(globalStore);

const { github, linkedin, twitter } = useRuntimeConfig().public.socialUrl;

const socialLinks = [
  {
    name: "Github",
    icon: "logo:github",
    url: github,
  },
  {
    name: "Twitter",
    icon: "logo:twitter",
    url: twitter,
  },
  {
    name: "Linkedin",
    icon: "logo:linkedin",
    url: linkedin,
  },
];
</script>

<template>
  <div class="grid h-full grid-rows-[1fr_125px] sm:grid-rows-[1fr_75px]">
    <div class="grid place-content-center m-8">
      <Transition mode="out-in">
        <!-- Select User -->
        <LoginSelectUser v-if="loginView === 'selectUser'" />

        <!-- Add user -->
        <LoginAddUser v-else-if="loginView === 'addUser'" />

        <!-- Form -->
        <LoginForm v-else-if="loginView === 'enterPassword'" />
      </Transition>
    </div>

    <div
      class="relative grid grid-cols-1 px-4 sm:grid-cols-3 sm:flex-row sm:px-8"
    >
      <!-- Socials -->
      <div class="flex items-center justify-center gap-4 sm:justify-start">
        <ClientOnly>
          <TooltipProvider
            v-for="social in socialLinks"
            :key="social.name"
            :delay-duration="100"
          >
            <Tooltip>
              <TooltipTrigger :default-open="false" as-child>
                <NuxtLink
                  :to="social.url"
                  :external="true"
                  target="_blank"
                  class="grid place-content-center"
                >
                  <Icon
                    class="rounded-[calc(var(--radius)+0.5px)]"
                    :name="social.icon"
                    size="36"
                    mode="svg"
                  />
                </NuxtLink>
              </TooltipTrigger>
              <TooltipContent :side-offset="6" class="w-fit rounded-lg text-sm">
                <p>{{ social.name }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ClientOnly>
      </div>

      <div class="grid place-content-center">
        <div class="flex items-center gap-2">
          <Icon name="logo:manjaro" size="40" />
          <span
            class="font-comfortaa select-none text-3xl font-bold"
            >manjaro</span
          >
        </div>
      </div>

      <!-- Desktop Environment Options -->
      <Popover v-if="loginView === 'enterPassword'">
        <PopoverTrigger
          class="absolute bottom-4 right-4 grid place-items-center rounded-full bg-secondary p-3 sm:right-8"
        >
          <Icon name="gnome:settings" size="16" />
        </PopoverTrigger>
        <PopoverContent class="w-fit rounded-2xl">
          <RadioGroup v-model="desktopEnvironment">
            <div
              v-for="environment in desktopEnvironments"
              :key="environment"
              class="flex items-center space-x-2"
            >
              <RadioGroupItem :id="environment" :value="environment" />
              <Label :for="environment">{{ environment }}</Label>
            </div>
          </RadioGroup>
        </PopoverContent>
      </Popover>
    </div>
  </div>
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
