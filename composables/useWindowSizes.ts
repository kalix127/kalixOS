import {
  useWindowSize,
  breakpointsTailwind,
  useBreakpoints,
} from "@vueuse/core";

export function useWindowSizes() {
  const isMobileOrTablet = useBreakpoints(breakpointsTailwind).smaller("lg");

  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const initialWindowSizes = computed(() => {
    if (isMobileOrTablet.value) {
      // Mobile or Tablet
      const width = Math.min(300, windowWidth.value * 0.9);
      const height = (width * 16) / 9;
      return { width: Math.round(width), height: Math.round(height) };
    }

    // Desktop
    const width = windowWidth.value * 0.8;
    const height = (width * 9) / 16;
    return { width: Math.round(width), height: Math.round(height) };
  });

  const minWindowSizes = computed(() => {
    if (isMobileOrTablet.value) {
      // Mobile or Tablet
      const minWidth = 250;
      const minHeight = (minWidth * 16) / 9;
      return { minWidth, minHeight };
    }

    // Desktop
    const minWidth = 900;
    const minHeight = (minWidth * 9) / 16;
    return { minWidth, minHeight };
  });

  return {
    initialWindowSizes,
    minWindowSizes,
  };
}
