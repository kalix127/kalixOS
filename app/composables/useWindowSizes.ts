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
    if (breakpoints.greater('md').value) return 'md'; 
    if (breakpoints.greater('sm').value) return 'sm';
    return 'default';
  };

  const initialWidth = computed(() => {
    const size = getBreakpointSize();
    switch (size) {
      case 'lg':
        return Math.round(windowWidth.value * 0.8);
      case 'md':
        return Math.round(windowWidth.value * 0.7);
      case 'sm':
        return Math.round(windowWidth.value * 0.6);
      default:
        return Math.round(Math.min(300, windowWidth.value * 0.9));
    }
  });

  const initialHeight = computed(() => {
    const size = getBreakpointSize();
    switch (size) {
      case 'lg':
        return Math.round((initialWidth.value * 9) / 16);
      case 'md':
        return Math.round((initialWidth.value * 10) / 16);
      case 'sm':
        return Math.round((initialWidth.value * 12) / 16);
      default:
        return Math.round((initialWidth.value * 16) / 9);
    }
  });

  const minWidth = computed(() => {
    const size = getBreakpointSize();
    switch (size) {
      case 'lg':
        return 900;
      case 'md':
        return 700;
      case 'sm':
        return 500;
      default:
        return 280;
    }
  });

  const minHeight = computed(() => {
    const size = getBreakpointSize();
    switch (size) {
      case 'lg':
        return Math.round((minWidth.value * 9) / 16);
      case 'md':
        return Math.round((minWidth.value * 10) / 16);
      case 'sm':
        return Math.round((minWidth.value * 12) / 16);
      default:
        return Math.round((minWidth.value * 16) / 9);
    }
  });

  return {
    initialWidth,
    initialHeight,
    minWidth,
    minHeight,
  };
}
