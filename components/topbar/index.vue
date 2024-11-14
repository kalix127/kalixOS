<script lang="ts" setup>
import { type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const globalStore = useGlobalStore();
const bootStore = useBootStore();

const { username, isAboutToSuspend, isLocked } = storeToRefs(globalStore);

const { isRestartModalOpen, isPowerOffModalOpen, isLogoutModalOpen } =
  storeToRefs(bootStore);
const { handlePowerUp, handleRestart, handlePoweroff } = bootStore;
const { handleLogout } = useAuth();

const { hasAppsAtTop } = storeToRefs(useDesktopStore());

const route = useRoute();
</script>

<template>
  <header
    @contextmenu.prevent=""
    :class="[
      cn(
        'relative flex min-h-[35px] select-none items-center bg-[#080404] bg-opacity-20 p-1 transition-all duration-500',
        props.class,
      ),
      route.name === 'login' ? '!bg-transparent' : '',
      hasAppsAtTop ? '!bg-opacity-100' : '',
    ]"
  >
    <!-- Left Section -->
    <div class="hidden flex-1 items-center sm:flex">
      <TopbarPlaces v-if="route.name === 'desktop'" />
    </div>

    <!-- Center Section -->
    <div class="flex flex-none items-center justify-center">
      <TopbarCalendar />
    </div>

    <!-- Right Section -->
    <div class="flex flex-1 items-center justify-end gap-2">
      <TopbarResources v-if="route.name === 'desktop'" />
      <TopbarSystemMenu v-if="!isLocked" />
    </div>

    <!-- Automatic suspend alert -->
    <Transition name="fade">
      <Alert
        class="absolute -bottom-24 sm:-bottom-20 left-1/2 z-[50000] max-w-72 -translate-x-1/2 border-none bg-popover xs:max-w-80 sm:max-w-96"
        :class="isLocked ? 'hidden' : ''"
        v-if="isAboutToSuspend"
      >
        <div class="flex items-center gap-4">
          <Icon name="gnome:suspend" size="28" />
          <div class="space-y-1">
            <AlertTitle class="font-extrabold tracking-normal">{{
              $t("automatic_suspend_title")
            }}</AlertTitle>
            <AlertDescription class="text-xs">
              {{ $t("automatic_suspend_description") }}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </Transition>

    <!-- Power off modals -->
    <TopbarPowerOffModal
      :title="$t('power_off')"
      :label="$t('power_off')"
      :description="$t('power_off_modal', { seconds: 60 })"
      :seconds="60"
      :isOpen="isPowerOffModalOpen"
      @closeModal="isPowerOffModalOpen = false"
      @action="handlePoweroff"
    />
    <TopbarPowerOffModal
      :title="$t('restart')"
      :label="$t('restart')"
      :description="$t('restart_modal', { seconds: 50 })"
      :seconds="50"
      :isOpen="isRestartModalOpen"
      @closeModal="isRestartModalOpen = false"
      @action="handleRestart"
    />
    <TopbarPowerOffModal
      :title="`${$t('logout')} ${username}`"
      :label="$t('logout')"
      :description="$t('logout_modal', { username, seconds: 60 })"
      :seconds="60"
      :isOpen="isLogoutModalOpen"
      @closeModal="isLogoutModalOpen = false"
      @action="handleLogout"
    />
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
