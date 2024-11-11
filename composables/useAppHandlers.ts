import VueDraggableResizable from "vue-draggable-resizable";
import { type AppNode } from "@/types";

export function useAppHandlers(
  app: Ref<AppNode>,
  appRef: Ref<InstanceType<typeof VueDraggableResizable>>,
) {
  const desktopStore = useDesktopStore();
  const { desktopRef } = storeToRefs(desktopStore);

  const { initialAppSizes } = useAppSizes();
  const { initialAppPositions } = useAppPositions();

  const updateAppSizes = (w: number, h: number) => {
    app.value.width = Math.round(w);
    app.value.height = Math.round(h);
  };

  const updateAppPosition = (x: number, y: number) => {
    app.value.x = Math.round(x);
    app.value.y = Math.round(y);
  };

  const handleActive = (value: boolean) => {
    app.value.isActive = value;
  };

  /*  Resize Handlers */
  const handleResizeStop = (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    updateAppSizes(width, height);
  };

  /* Drag handlers */
  const handleDragStop = (x: number, y: number) => {
    // Prevent the app from being dragged outside the desktop bounds
    // Set 1 to avoid animation bug when the value is 0
    if (x <= 0) x = 1;
    if (y <= 0) y = 1;

    updateAppPosition(x, y);
  };
  const handleDragging = (x: number, y: number) => {
    // Update the app's position only if the user is dragging the app to the top bar
    if (y < 2 || (y > 2 && y < 20)) {
      handleDragStop(x, y);
    }
  };

  const handleFullscreen = (value?: boolean) => {
    // If value is provided, set fullscreen directly
    if (typeof value !== 'undefined') {
      app.value.isFullscreen = value;
      if (value) {
        // Store current size/position before going fullscreen
        app.value.prev.width = app.value.width;
        app.value.prev.height = app.value.height;
        app.value.prev.x = app.value.x;
        app.value.prev.y = app.value.y;

        // Set fullscreen size/position
        updateAppSizes(desktopRef.value?.offsetWidth || 0, desktopRef.value?.offsetHeight || 0);
        updateAppPosition(1, 1);
      } else {
        // Restore previous size/position
        updateAppSizes(app.value.prev.width, app.value.prev.height);
        updateAppPosition(app.value.prev.x, app.value.prev.y);
      }
      return;
    }

    // Default toggle behavior
    if (app.value.isFullscreen) {
      app.value.isFullscreen = false;
      updateAppSizes(app.value.prev.width, app.value.prev.height);
      updateAppPosition(app.value.prev.x, app.value.prev.y);
      return;
    }

    // Store the size and position now in order to restore them later
    app.value.prev.width = app.value.width;
    app.value.prev.height = app.value.height;
    app.value.prev.x = app.value.x;
    app.value.prev.y = app.value.y;

    // Set the full screen
    app.value.isFullscreen = true;
    updateAppSizes(desktopRef.value?.offsetWidth || 0, desktopRef.value?.offsetHeight || 0);
    updateAppPosition(1, 1);
  };

  // Hooks

  onBeforeMount(() => {
    // Update the app's size and position if it's the first open
    if (!app.value.width || !app.value.height || !app.value.x || !app.value.y) {
      updateAppSizes(initialAppSizes.value.width, initialAppSizes.value.height);
      updateAppPosition(
        initialAppPositions.value.x,
        initialAppPositions.value.y,
      );
    }
  });

  // Needed to fix the fullscreen logic and make sure to update the sizes
  onUpdated(() => {
    if (appRef.value) {
      appRef.value.width = app.value.width;
      appRef.value.height = app.value.height;
    }
  });

  return {
    handleActive,
    handleResizeStop,
    handleDragging,
    handleDragStop,
    handleFullscreen,
    appRef,
  };
}
