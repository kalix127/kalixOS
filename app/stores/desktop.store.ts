import type {
  AppNode,
  BackgroundImage,
  FolderNode,
  Node,
  NodeSeed,
  Notification,
  Process,
  ShortcutNode,
} from "@/types";
import {
  breakpointsTailwind,
  useBreakpoints,
  useIdle,
  useIntervalFn,
  useTimeoutFn,
  useTimestamp,
} from "@vueuse/core";
import {
  defaultApps,
  defaultBackgroundImage,
  defaultBackgroundImages,
  defaultBookmarks,
  defaultFileSystem,
} from "@/constants";
import { assignDefaultProperties, findNodeByIdRecursive, getNextPid, getNodeIcon } from "@/helpers";

type CreateNodeInput = Omit<
  NodeSeed,
  "id" | "parentId" | "permissions" | "owner" | "group" | "createdAt" | "icon"
> & { icon?: string };

export const useDesktopStore = defineStore("desktopStore", {
  state: (): DesktopStore => ({
    fileSystem: defaultFileSystem(
      storeToRefs(useGlobalStore()).username.value.toLowerCase(),
    ),
    nodeMap: new Map<string, Node>(),
    bookmarks: defaultBookmarks,
    uptime: 0,
    processes: [],

    isDockVisible: true,
    isDockPinned: true,

    apps: defaultApps,

    desktopRef: null,
    backgroundImage: defaultBackgroundImage,
    backgroundImages: defaultBackgroundImages,
    isShowAppsOverlayVisible: false,
    notifications: [],
  }),
  getters: {
    homeNode(state): FolderNode | null {
      const node = findNodeByIdRecursive(state.fileSystem, "home");
      return node && node.type === "folder" ? node : null;
    },

    desktopNode(state): FolderNode | null {
      const node = findNodeByIdRecursive(state.fileSystem, "desktop");
      return node && node.type === "folder" ? node : null;
    },

    trashNode(state): FolderNode | null {
      const node = findNodeByIdRecursive(state.fileSystem, "trash");
      return node && node.type === "folder" ? node : null;
    },

    desktopItems(): Node[] {
      if (!this.desktopNode)
        return [];
      return this.desktopNode.children ? this.desktopNode.children : [];
    },

    trashItems(): Node[] {
      if (!this.trashNode)
        return [];
      return this.trashNode.children ? this.trashNode.children : [];
    },

    openApps(state): AppNode[] {
      return state.apps.filter(app => app.isOpen);
    },

    hasAppFullscreen(): boolean {
      return this.openApps.some(app => app.isFullscreen);
    },

    bookmarksNodes(state): Node[] {
      return state.bookmarks
        .map(id => state.nodeMap.get(id))
        .filter((node): node is Node => node !== undefined);
    },
  },
  actions: {
    resetDesktopEnv() {
      const username = storeToRefs(useGlobalStore()).username.value;

      this.nodeMap.clear();
      this.bookmarks = [];
      this.processes = [];

      this.fileSystem = defaultFileSystem(username.toLowerCase());

      this.apps = defaultApps;
      this.backgroundImage = defaultBackgroundImage;
      this.backgroundImages = defaultBackgroundImages;

      if (this.fileSystem.type === "folder") {
        this.initializeNodeMap(this.fileSystem);
      }
    },

    init(): void {
      const username = storeToRefs(useGlobalStore()).username.value;
      const homeNode = findNodeByIdRecursive(this.fileSystem, "home");

      if (homeNode && homeNode.type === "folder" && homeNode.name.toLowerCase() !== username.toLowerCase()) {
        this.resetDesktopEnv();
      } else {
        if (this.fileSystem.type === "folder") {
          this.initializeNodeMap(this.fileSystem);
        }
      }

      this.initIdleDetection();
      this.initUptime();
    },

    initializeNodeMap(node: Node): void {
      this.nodeMap.set(node.id, node);
      if (node.type === "folder") {
        node.children.forEach(child => this.initializeNodeMap(child));
      }
    },

    initIdleDetection(): void {
      if (import.meta.client) {
        const globalStore = useGlobalStore();
        const {
          isAuthenticated,
          isLocked,
          isAboutToSuspend,
          suspendedPercentage,
          dimScreenThreshold,
        } = storeToRefs(globalStore);
        const { handleSuspend } = globalStore;

        const { lastActive } = useIdle(Number.parseInt(dimScreenThreshold.value));

        const now = useTimestamp({ interval: 1000 });

        const idledFor = computed(() =>
          Math.floor((now.value - lastActive.value) / 1000),
        );

        let hasShownNotification = false;

        watch(idledFor, (newValue: number) => {
          if (dimScreenThreshold.value === "0")
            return;

          const updatedDimScreenThreshold = Number.parseInt(
            storeToRefs(globalStore).dimScreenThreshold.value,
          );
          const isDimScreenEnabled
            = storeToRefs(globalStore).isDimScreenEnabled;

          const idleThreshold = Math.floor(
            (updatedDimScreenThreshold * 0.7) / 1000,
          );
          const suspendPercentage
            = newValue < idleThreshold
              ? 0
              : Math.min(
                  (newValue - idleThreshold)
                  / ((updatedDimScreenThreshold * 0.3) / 1000),
                  1,
                );

          if (newValue === 0) {
            hasShownNotification = false;
          }

          isAboutToSuspend.value = newValue >= idleThreshold;

          if (isAboutToSuspend.value && !hasShownNotification) {
            this.addNotification(
              {
                id: "suspend",
                title: "automatic_suspend_title",
                description: "automatic_suspend_description",
                icon: "gnome:suspend",
                isTranslated: true,
              },
              10000,
            );
            hasShownNotification = true;
          }

          if (isDimScreenEnabled.value) {
            suspendedPercentage.value = suspendPercentage;
          }

          if (newValue * 1000 >= Number.parseInt(dimScreenThreshold.value)) {
            if (!isAuthenticated.value)
              return;

            handleSuspend();
            isLocked.value = true;
          }
        });
      }
    },

    initUptime(): void {
      useIntervalFn(() => {
        this.uptime += 1;
      }, 1000);
    },

    moveNode(nodeId: string, targetFolderId: string): boolean {
      const node = this.nodeMap.get(nodeId);
      const targetFolder = this.nodeMap.get(targetFolderId);

      if (!node || !targetFolder || targetFolder.type !== "folder")
        return false;

      if (node.isProtected)
        return false;

      if (nodeId === targetFolderId)
        return false;

      if (node.type === "folder" && this.isDescendant(node, targetFolder)) {
        return false;
      }

      const currentParentId = node.parentId;
      if (!currentParentId)
        return false;
      const currentParent = this.nodeMap.get(currentParentId);
      if (!currentParent || currentParent.type !== "folder")
        return false;

      currentParent.children = currentParent.children.filter(
        child => child.id !== nodeId,
      );

      targetFolder.children = targetFolder.children || [];
      targetFolder.children.push(node);

      node.parentId = targetFolder.id;

      return true;
    },

    createNode(
      parentId: string,
      newNode: CreateNodeInput,
      checkDuplicates: boolean = false,
    ): Node | null {
      const parent = this.nodeMap.get(parentId);
      if (!parent || parent.type !== "folder")
        return null;

      const username
        = storeToRefs(useGlobalStore()).username.value.toLowerCase();

      let shortcutTargetType: ShortcutNode["targetType"] | undefined;
      if (newNode.type === "shortcut") {
        if (!newNode.targetId) {
          return null;
        }
        const targetNode = this.nodeMap.get(newNode.targetId);
        if (!targetNode || targetNode.type === "shortcut") {
          return null;
        }
        shortcutTargetType = targetNode.type;
      }

      if (checkDuplicates && newNode.name) {
        let counter = 1;
        let newName = newNode.name;
        while (parent.children.some(child => child.name === newName)) {
          newName = `${newNode.name} (${counter})`;
          counter++;
        }
        newNode.name = newName;
      }

      const createdNode = assignDefaultProperties(
        {
          ...newNode,
          icon: newNode.icon || getNodeIcon(newNode.type, newNode.name || ""),
          targetType: shortcutTargetType ?? newNode.targetType,
        },
        username,
        parent.id,
      );

      parent.children.push(createdNode);
      this.nodeMap.set(createdNode.id, createdNode);

      return createdNode;
    },

    createNodeShortcut(
      targetNode: Node,
      linkParentNode: FolderNode,
      linkName: string,
    ): [boolean, string] {
      const username
        = storeToRefs(useGlobalStore()).username.value.toLowerCase();

      const existingNode = linkParentNode.children.find(
        child => child.name === linkName,
      );
      if (existingNode) {
        return [false, `cannot create link '${linkName}': File exists`];
      }

      if (targetNode.type === "shortcut") {
        return [false, "cannot create link to a shortcut"];
      }

      const shortcutNode = assignDefaultProperties(
        {
          name: linkName,
          type: "shortcut",
          icon: targetNode.icon,
          targetId: targetNode.id,
          targetType: targetNode.type,
        },
        username,
        linkParentNode.id,
      );

      linkParentNode.children.push(shortcutNode);
      this.nodeMap.set(shortcutNode.id, shortcutNode);

      return [true, ""];
    },

    editNode(
      nodeId: string,
      updatedData: Partial<Omit<Node, "id" | "parentId">>,
    ): boolean {
      const node = this.nodeMap.get(nodeId);
      if (!node)
        return false;

      if (node.isProtected)
        return false;

      if (updatedData.type && updatedData.type !== node.type) {
        return false;
      }

      if (node.type === "shortcut" && updatedData.targetId) {
        const targetNode = this.nodeMap.get(
          updatedData.targetId,
        );
        if (!targetNode || targetNode.type === "shortcut") {
          return false;
        }
        node.targetId = updatedData.targetId;
        node.targetType = targetNode.type;
      }

      if (node.type === "file" && updatedData?.name) {
        updatedData.icon = getNodeIcon(node.type, updatedData.name);
      }

      Object.assign(node, updatedData);
      return true;
    },

    deleteNode(nodeId: string): boolean {
      const node = this.nodeMap.get(nodeId);
      if (!node)
        return false;

      if (node.isProtected)
        return false;

      const parentId = node.parentId;
      if (!parentId)
        return false;

      const parent = this.nodeMap.get(parentId);
      if (!parent || parent.type !== "folder")
        return false;

      const index = parent.children.findIndex(child => child.id === nodeId);
      if (index === -1)
        return false;

      parent.children.splice(index, 1);

      this.deleteNodeRecursively(node);
      this.removeShortcutsTo(nodeId);

      return true;
    },

    isDescendant(node: Node, targetNode: Node): boolean {
      if (!targetNode.parentId)
        return false;
      if (targetNode.parentId === node.id)
        return true;
      const parentNode = this.nodeMap.get(targetNode.parentId);
      if (!parentNode)
        return false;
      return this.isDescendant(node, parentNode);
    },

    deleteNodeRecursively(node: Node): void {
      if (node.type === "folder") {
        node.children.forEach((child) => {
          this.deleteNodeRecursively(child);
        });
      }
      this.nodeMap.delete(node.id);
    },

    removeShortcutsTo(targetId: string): void {
      const shortcutsToRemove: string[] = [];

      for (const [id, node] of this.nodeMap.entries()) {
        if (node.type === "shortcut" && node.targetId === targetId) {
          shortcutsToRemove.push(id);
        }
      }

      for (const shortcutId of shortcutsToRemove) {
        this.deleteNode(shortcutId);
      }
    },

    updateDesktopItems(newItems: Node[]) {
      if (this.desktopNode) {
        this.desktopNode.children = [];

        newItems.forEach((item) => {
          this.desktopNode!.children!.push(item);
          this.nodeMap.set(item.id, item);
        });
      }
    },

    updateDockApps(newItems: AppNode[]) {
      this.apps = newItems.filter(
        (app, index, self) => index === self.findIndex(t => t.id === app.id),
      );
    },

    emptyTrash() {
      if (this.trashItems.length === 0)
        return;
      const itemsToDelete = [...this.trashItems];
      for (const item of itemsToDelete) {
        this.deleteNode(item.id);
      }
    },

    async openApp(appId: string, toggleMinimize?: boolean) {
      const app = this.apps.find(app => app.id === appId);
      if (!app)
        return;

      if (appId === "kate") {
        const { openedNode } = storeToRefs(useKateStore());
        if (!openedNode.value)
          return;
      }

      const applicationsNode = this.nodeMap.get("applications");
      if (!applicationsNode || applicationsNode.type !== "folder")
        return;

      const appExists = applicationsNode.children?.some(
        child => child.id === appId,
      );
      if (!appExists) {
        const { t } = useNuxtApp().$i18n;

        this.addNotification(
          {
            id: `app-not-found-${app.id}`,
            title: t("app_not_found"),
            description: t("app_not_found_description", {
              appName: app.name,
            }),
            icon: "gnome:triangle-warning",
            isTranslated: false,
          },
          5000,
        );
        return;
      }

      const isMobileOrTablet
        = useBreakpoints(breakpointsTailwind).smaller("lg").value;
      if (isMobileOrTablet) {
        const { t } = useNuxtApp().$i18n;
        this.addNotification(
          {
            id: `app-not-available-${app.id}`,
            title: t("app_not_available"),
            description: t(`${app.id}_not_available_on_mobile`, {
              appName: app.name,
            }),
            icon: "gnome:triangle-warning",
            isTranslated: false,
          },
          5000,
        );
        return;
      }

      if (!app.isOpen) {
        this.apps = this.apps.map(app => ({
          ...app,
          isOpen: app.id === appId ? true : app.isOpen,
          isMinimized: app.id === appId ? false : app.isMinimized,
          isActive: app.id === appId ? true : app.isActive,
        }));

        this.createProcess(app.id, app.name.toLowerCase());
        return;
      }

      if (toggleMinimize) {
        this.toggleMinimizeApp(appId);
      }

      this.updateApp(appId, {
        isActive: true,
      });
    },

    closeApp(appId: string) {
      this.apps = this.apps.map(app => ({
        ...app,
        isOpen: app.id === appId ? false : app.isOpen,
        isMinimized: app.id === appId ? false : app.isMinimized,
        isActive: app.id === appId ? false : app.isActive,
      }));

      this.closeProcess(appId);
    },

    toggleMinimizeApp(appId: string) {
      this.apps = this.apps.map(app => ({
        ...app,
        isMinimized: app.id === appId ? !app.isMinimized : app.isMinimized,
        isActive: app.id === appId ? false : app.isActive,
      }));
    },

    updateApp(appId: string, changes: Partial<AppNode>) {
      this.apps = this.apps.map(app =>
        app.id === appId ? { ...app, ...changes } : app,
      );
    },

    addToBookmarks(nodeId: string) {
      if (!this.bookmarks.includes(nodeId)) {
        this.bookmarks.push(nodeId);
      }
    },

    removeFromBookmarks(nodeId: string) {
      this.bookmarks = this.bookmarks.filter(id => id !== nodeId);
    },

    setBackgroundImage(image: BackgroundImage) {
      this.backgroundImage = image;

      if (!this.backgroundImages.some(bg => bg.url === image.url)) {
        this.backgroundImages.push(image);
      }
    },

    deleteBackgroundImage(imageUrl: string) {
      this.backgroundImages = this.backgroundImages.filter(
        bg => bg.url !== imageUrl,
      );

      if (
        this.backgroundImage.url === imageUrl
        || this.backgroundImages.length === 1
      ) {
        this.backgroundImage = defaultBackgroundImage;
      }
    },

    createProcess(appId: string, command: string) {
      if (this.processes.some(process => process.appId === appId))
        return;

      this.processes.push({
        pid: getNextPid(this.processes),
        appId,
        startTimeTimestamp: useTimestamp({ offset: 0 }).value,
        command,
      });
    },
    closeProcess(appId: string) {
      this.processes = this.processes.filter(
        process => process.appId !== appId,
      );
    },

    addNotification(notification: Notification, timeout = 5000) {
      if (this.notifications.some(n => n.id === notification.id))
        return;

      this.notifications.push(notification);

      useTimeoutFn(() => {
        this.deleteNotification(notification.id);
      }, timeout);
    },
    deleteNotification(id: string) {
      this.notifications = this.notifications.filter(
        notification => notification.id !== id,
      );
    },
  },
});

interface DesktopStore {
  fileSystem: Node;
  nodeMap: Map<string, Node>;
  bookmarks: string[];
  uptime: number;
  processes: Process[];

  isDockVisible: boolean;
  isDockPinned: boolean;

  apps: AppNode[];

  desktopRef: HTMLElement | null;
  backgroundImage: BackgroundImage;
  backgroundImages: BackgroundImage[];
  isShowAppsOverlayVisible: boolean;
  notifications: Notification[];
}
