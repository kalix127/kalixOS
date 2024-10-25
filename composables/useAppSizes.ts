import { useWindowSize } from "@vueuse/core";

export function useAppSizes() {
  const { isMobileOrTablet } = useDevice();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const initialAppSizes = computed(() => {
    if (isMobileOrTablet) {
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

  return {
    initialAppSizes,
  };
}
