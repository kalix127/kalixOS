import { useWindowSize } from "@vueuse/core";

export function useWindowSizes() {
  const { width: windowWidth } = useWindowSize();

  const initialWidth = computed(() => {
    return Math.round(windowWidth.value * 0.7);
  });

  const initialHeight = computed(() => {
    return Math.round((initialWidth.value * 9) / 16);
  });

  const minWidth = computed(() => {
    return 900;
  });

  const minHeight = computed(() => {
    return Math.round((minWidth.value * 9) / 16);
  });

  return {
    initialWidth,
    initialHeight,
    minWidth,
    minHeight,
  };
}
