export function useAuth() {
  const globalStore = useGlobalStore();
  const { isAuthenticated, isLocked, loginView } = storeToRefs(globalStore);
  const { isLogoutModalOpen } = storeToRefs(useBootStore());
  const { setIsAuthenticated } = globalStore;

  const isLoading = ref(false);
  const isPasswordVisible = ref(false);

  const handleBack = () => {
    loginView.value = "selectUser";
  };

  const handleLogin = async (password: string): Promise<boolean> => {
    isLoading.value = true;
    // Fake delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (password === "password") {
      setIsAuthenticated(true);

      await navigateTo("/desktop");
      isLoading.value = false;
      return true;
    } else {
      isLoading.value = false;
      return false;
    }
  };

  const handleLogout = async () => {
    // TODO: When implementing the desktop, make sure to reset the desktop store
    setIsAuthenticated(false);
    isLogoutModalOpen.value = false;

    await navigateTo("/login");
  };

  const handleUnlock = async (password: string): Promise<boolean> => {
    isLoading.value = true;
    // Fake delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (password === "password") {
      isLocked.value = false;
      isLoading.value = false;
      return true;
    } else {
      isLoading.value = false;
      return false;
    }
  };

  return {
    isLoading,
    isPasswordVisible,
    handleBack,
    handleLogin,
    handleLogout,
    handleUnlock,
    isAuthenticated,
    isLocked,
    loginView,
  };
}
