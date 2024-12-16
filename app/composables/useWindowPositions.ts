import { useWindowSize as useViewportSize } from "@vueuse/core";

export function useWindowPositions() {
  const desktopStore = useDesktopStore();
  const { desktopRef } = storeToRefs(desktopStore);

  const { width: viewportWidth, height: viewportHeight } = useViewportSize();
  const { initialWidth, initialHeight } = useWindowSizes();

  const initialX = computed(() => {
    const desktopWidth = desktopRef.value?.offsetWidth || viewportWidth.value;
    const x = Math.max(0, Math.floor(desktopWidth - initialWidth.value) / 2);
    return Math.round(x);
  });

  const initialY = computed(() => {
    const desktopHeight = desktopRef.value?.offsetHeight || viewportHeight.value;
    const y = Math.max(0, Math.floor(desktopHeight - initialHeight.value) / 2);
    return Math.round(y);
  });

  return {
    initialX,
    initialY,
  };
}
