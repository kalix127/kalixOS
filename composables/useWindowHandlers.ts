import VueDraggableResizable from "vue-draggable-resizable";
import { type AppNode } from "@/types";
import { useThrottleFn } from "@vueuse/core";

export function useWindowHandlers(
  app: Ref<AppNode>,
  appRef: Ref<InstanceType<typeof VueDraggableResizable>>,
) {
  const desktopStore = useDesktopStore();
  const { desktopRef } = storeToRefs(desktopStore);
  const { updateApp } = desktopStore;

  const { initialWindowSizes } = useWindowSizes();
  const { initialWindowPositions } = useWindowPositions();

  const updateWindowSizes = (w: number, h: number) => {
    app.value.width = Math.round(w);
    app.value.height = Math.round(h);
  };

  const updateWindowPosition = (x: number, y: number) => {
    app.value.x = Math.round(x);
    app.value.y = Math.round(y);
  };

  const handleActive = (value: boolean) => {
    app.value.isActive = value;
  };

  /*  Resize Handlers */
  const handleResizeStop = useThrottleFn(
    (x: number, y: number, width: number, height: number) => {
      updateWindowSizes(width, height);
    },
    25,
  );

  /* Drag handlers */
  const handleDragStop = useThrottleFn((x: number, y: number) => {
    updateWindowPosition(x, y);
  }, 25);

  const handleDragging = useThrottleFn((x: number, y: number) => {
    // Update the app's position only if the user is dragging the app to the top bar
    if (y >= 0 && y < 200) {
      handleDragStop(x, y);
    }
  }, 25);

  const handleFullscreen = (value?: boolean) => {
    // If value is provided, set fullscreen directly
    if (typeof value !== "undefined") {
      app.value.isFullscreen = value;
      if (value) {
        // Store current size/position before going fullscreen
        app.value.prev.width = app.value.width;
        app.value.prev.height = app.value.height;
        app.value.prev.x = app.value.x;
        app.value.prev.y = app.value.y;

        // Set fullscreen size/position
        updateWindowSizes(
          desktopRef.value?.offsetWidth || 0,
          desktopRef.value?.offsetHeight || 0,
        );
        updateWindowPosition(0, 0);
      } else {
        // Restore previous size/position
        updateWindowSizes(app.value.prev.width, app.value.prev.height);
        updateWindowPosition(app.value.prev.x, app.value.prev.y);
      }
      return;
    }

    // Default toggle behavior
    if (app.value.isFullscreen) {
      app.value.isFullscreen = false;
      updateWindowSizes(app.value.prev.width, app.value.prev.height);
      updateWindowPosition(app.value.prev.x, app.value.prev.y);
      return;
    }

    // Store the size and position now in order to restore them later
    app.value.prev.width = app.value.width;
    app.value.prev.height = app.value.height;
    app.value.prev.x = app.value.x;
    app.value.prev.y = app.value.y;

    // Set the full screen
    app.value.isFullscreen = true;
    updateWindowSizes(
      desktopRef.value?.offsetWidth || 0,
      desktopRef.value?.offsetHeight || 0,
    );
    updateWindowPosition(0, 0);
  };

  // Hooks

  onBeforeMount(() => {
    if (!app.value.isNewlyOpened) return;

    // Update the app's size and position if it's the first open
    if (!app.value.width || !app.value.height || !app.value.x || !app.value.y) {
      updateWindowSizes(
        initialWindowSizes.value.width,
        initialWindowSizes.value.height,
      );
      updateWindowPosition(
        initialWindowPositions.value.x,
        initialWindowPositions.value.y,
      );
      updateApp(app.value.id, { isNewlyOpened: false });
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
