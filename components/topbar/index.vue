<script lang="ts" setup>
import { type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const globalStore = useGlobalStore();

const {
  isPowerOffModalOpen,
  isRestartModalOpen,
  isLogoutModalOpen,
  username,
  isAboutToSuspend,
  isLocked,
} = storeToRefs(globalStore);
const { handlePoweroff, handleRestart, handleLogout } = globalStore;

const { hasAppsAtTop } = storeToRefs(useDesktopStore());

const route = useRoute();
</script>

<template>
  <header
    @contextmenu.prevent=""
    :class="[
      cn(
        'relative flex min-h-[35px] select-none items-center justify-between bg-[#080404] bg-opacity-20 p-1 transition-all duration-500',
        props.class,
      ),
      route.name === 'login' ? '!bg-transparent' : '',
      hasAppsAtTop ? '!bg-opacity-100' : '',
    ]"
  >
    <!-- Show default home folders -->
    <TopbarPlaces />

    <!-- Calendar -->
    <TopbarCalendar />

    <!-- Main menu -->
    <div class="flex items-center justify-end gap-2">
      <TopbarResources />
      <TopbarSystemMenu />
    </div>

    <!-- Automatic suspend alert -->
    <Transition name="fade">
      <Alert
        class="absolute border-none -bottom-20 left-1/2 z-[50000] max-w-72 xs:max-w-80 -translate-x-1/2 bg-popover sm:max-w-96"
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
