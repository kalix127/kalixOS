import { useWindowSize } from "@vueuse/core";

export function useAppPositions() {
  const desktopStore = useDesktopStore();
  const { desktopRef } = storeToRefs(desktopStore);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const { initialAppSizes } = useAppSizes();

  const initialAppPositions = computed(() => {
    const desktopWidth = desktopRef.value?.offsetWidth || windowWidth.value;
    const desktopHeight = desktopRef.value?.offsetHeight || windowHeight.value;

    const x = Math.max(
      0,
      Math.floor((desktopWidth - initialAppSizes.value.width) / 2),
    );
    const y = Math.max(
      0,
      Math.floor((desktopHeight - initialAppSizes.value.height) / 2),
    );

    return { x: Math.round(x), y: Math.round(y) };
  });

  return {
    initialAppPositions,
  };
}
