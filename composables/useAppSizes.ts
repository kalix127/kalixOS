import { useWindowSize } from "@vueuse/core";

export function useAppSizes() {
  const { isMobileOrTablet: device } = useDevice();
  const isMobileOrTablet = toRef(device);

  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const initialAppSizes = computed(() => {
    if (isMobileOrTablet.value) {
      // Mobile or Tablet
      const width = Math.min(300, windowWidth.value * 0.9);
      const height = (width * 16) / 9;
      return { width: Math.round(width), height: Math.round(height) };
    }

    // Desktop
    const width = windowWidth.value * 0.7;
    const height = (width * 9) / 16;
    return { width: Math.round(width), height: Math.round(height) };
  });

  const minAppSizes = computed(() => {
    if (isMobileOrTablet.value) {
      // Mobile or Tablet
      const minWidth = 250;
      const minHeight = (minWidth * 16) / 9;
      return { minWidth, minHeight };
    }

    // Desktop
    const minWidth = 500;
    const minHeight = (minWidth * 9) / 16;
    return { minWidth, minHeight };
  });

  return {
    initialAppSizes,
    minAppSizes,
  };
}
