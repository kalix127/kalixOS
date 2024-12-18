import type { AppNode } from "@/types";
import type { Component } from "vue";
import DesktopAppBrave from "@/components/desktop/app/Brave.vue";

import DesktopAppFiles from "@/components/desktop/app/files/index.vue";
import DesktopAppKate from "@/components/desktop/app/Kate.vue";
import Settings from "@/components/desktop/app/settings/index.vue";
import DesktopAppTerminal from "@/components/desktop/app/Terminal.vue";
import DesktopAppVSCode from "@/components/desktop/app/VSCode.vue";
import { defaultFullscreenApps } from "@/constants";

const appComponents: Record<string, Component> = {
  settings: Settings,
  code: DesktopAppVSCode,
  brave: DesktopAppBrave,
  terminal: DesktopAppTerminal,
  kate: DesktopAppKate,
  files: DesktopAppFiles,
};

export function useWindow(app: Ref<AppNode>) {
  const { initialX, initialY } = useWindowPositions();
  const { initialWidth, initialHeight } = useWindowSizes();
  const { updateApp } = useDesktopStore();

  const localX = ref(initialX.value);
  const localY = ref(initialY.value);
  const localWidth = ref(initialWidth.value);
  const localHeight = ref(initialHeight.value);
  const isFullscreen = ref(app.value.isFullscreen || false);
  const isActive = ref(true);

  const prevState = reactive({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const handleFullscreen = (value: boolean) => {
    isFullscreen.value = value;
    updateApp(app.value.id, {
      isFullscreen: value,
    });

    if (!isFullscreen.value) {
      // Restore previous dimensions
      localWidth.value = prevState.width;
      localHeight.value = prevState.height;
      localX.value = prevState.x;
      localY.value = prevState.y;
      return;
    }

    // Store current values
    prevState.width = localWidth.value;
    prevState.height = localHeight.value;
    prevState.x = localX.value;
    prevState.y = localY.value;

    // Set fullscreen dimensions
    localWidth.value = window.innerWidth;
    localHeight.value = window.innerHeight - 36; // 36px is the topbar height
    localX.value = 0;
    localY.value = 0;
  };

  const handleActive = (value: boolean) => {
    if (app.value.isDropdownOpen && !value) {
      isActive.value = true;
      return;
    }
    isActive.value = value;
  };

  const getAppComponent = (appId: string): Component => {
    const component = appComponents[appId];
    if (!component) {
      throw new Error("Unexpected error");
    }
    return component;
  };

  onMounted(() => {
    if (defaultFullscreenApps.includes(app.value.id)) {
      handleFullscreen(true);
    }
  });

  return {
    localWidth,
    localHeight,
    localX,
    localY,
    isFullscreen,
    isActive,
    handleFullscreen,
    getAppComponent,
    handleActive,
  };
}
