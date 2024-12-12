<script setup lang="ts">
import { desktopEnvironments } from "@/constants";

const globalStore = useGlobalStore();
const { loginView, desktopEnvironment } = storeToRefs(globalStore);

const { github, linkedin } = useRuntimeConfig().public.socialUrl;

const socialLinks = [
  {
    name: "Github",
    icon: "logo:github",
    url: github,
  },
  {
    name: "Linkedin",
    icon: "logo:linkedin",
    url: linkedin,
  },
];
</script>

<template>
  <div
    class="relative order-2 flex flex-col justify-center px-4 py-2 sm:flex-row sm:px-8"
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

        <!-- Social Skeleton -->
        <template #fallback>
          <Skeleton class="h-8 w-36 rounded-md" />
        </template>
      </ClientOnly>
    </div>

    <!-- Desktop Environment Options -->
    <Popover v-if="loginView === 'enterPassword'">
      <PopoverTrigger
        class="absolute bottom-4 right-4 grid place-items-center rounded-full bg-secondary p-3 sm:right-8"
      >
        <Icon name="gnome:settings" size="16" />
      </PopoverTrigger>
      <PopoverContent class="mr-2 w-fit rounded-2xl">
        <RadioGroup v-model="desktopEnvironment">
          <div
            v-for="environment in desktopEnvironments"
            :key="environment"
            class="flex items-center space-x-2"
          >
            <RadioGroupItem :id="environment" :value="environment" />
            <Label :for="environment">{{
              $t(`desktop_environment.${environment}`)
            }}</Label>
          </div>
        </RadioGroup>
      </PopoverContent>
    </Popover>
  </div>
</template>

<style scoped></style>
