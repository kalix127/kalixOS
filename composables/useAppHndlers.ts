import VueDraggableResizable from "vue-draggable-resizable";
import { type AppNode } from "@/types";

export function useAppHandlers(
  app: Ref<AppNode>,
  appRef: Ref<InstanceType<typeof VueDraggableResizable>>,
) {
  const desktopStore = useDesktopStore();
  const { enterFullscreen, exitFullscreen, updateApp } = desktopStore;

  const { initialAppSizes } = useAppSizes();
  const { initialAppPositions } = useAppPositions();

  const handleActivated = () => {
    desktopStore.activeApp = app.value;
  };

  const handleDeactivated = () => {
    desktopStore.activeApp = null;
  };

  const handleResizeStop = (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    const updatedData = {
      width: Math.round(width),
      height: Math.round(height),
    };
    updateApp(app.value.id, updatedData);
  };

  const handleDragStop = (x: number, y: number) => {
    // Prevent the app from being dragged outside the desktop bounds
    // Set 1 to avoid animation bug when the value is 0
    if (x <= 0) x = 1;
    if (y <= 0) y = 1;

    const updatedData = {
      x: Math.round(x),
      y: Math.round(y),
    };
    updateApp(app.value.id, updatedData);
  };

  const handleDragging = (x: number, y: number) => {
    // Update the app's position only if the user is dragging the app to the top bar
    if (y < 2 || (y > 2 && y < 20)) {
      handleDragStop(x, y);
    }
  };

  const handleFullscreen = () => {
    // If the app is already fullscreen, exit fullscreen
    if (app.value.isFullscreen) {
      exitFullscreen(
        app.value.id,
        initialAppSizes.value.width,
        initialAppSizes.value.height,
        initialAppPositions.value.x,
        initialAppPositions.value.y,
      );
      return;
    }

    // Else, enter fullscreen
    enterFullscreen(app.value.id);
  };

  onMounted(() => {
    // Update the app's size and position if it's the first open
    if (!app.value.width || !app.value.height || !app.value.x || !app.value.y) {
      const updatedData = {
        ...initialAppSizes.value,
        ...initialAppPositions.value,
      };
      updateApp(app.value.id, updatedData);
    }
  });

  onUpdated(() => {
    if (appRef.value) {
      appRef.value.width = app.value.width;
      appRef.value.height = app.value.height;
    }
  });

  return {
    handleActivated,
    handleDeactivated,
    handleResizeStop,
    handleDragging,
    handleDragStop,
    handleFullscreen,
    appRef,
  };
}
