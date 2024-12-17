import {
  useWindowSize,
  breakpointsTailwind,
  useBreakpoints,
} from "@vueuse/core";

export function useWindowSizes() {
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const { width: windowWidth} = useWindowSize();

  const getBreakpointSize = () => {
    if (breakpoints.greater('lg').value) return 'lg';
    return 'default';
  };

  const initialWidth = computed(() => {
    const size = getBreakpointSize();
    switch (size) {
      case 'lg':
        return Math.round(windowWidth.value * 0.8);
      default:
        return 0;
    }
  });

  const initialHeight = computed(() => {
    const size = getBreakpointSize();
    switch (size) {
      case 'lg':
        return Math.round((initialWidth.value * 9) / 16);
      default:
        return 0;
    }
  });

  const minWidth = computed(() => {
    const size = getBreakpointSize();
    switch (size) {
      case 'lg':
        return 900;
      default:
        return 0;
    }
  });

  const minHeight = computed(() => {
    const size = getBreakpointSize();
    switch (size) {
      case 'lg':
        return Math.round((minWidth.value * 9) / 16);
      default:
        return 0;
    }
  });

  return {
    initialWidth,
    initialHeight,
    minWidth,
    minHeight,
  };
}
