export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated } = storeToRefs(useGlobalStore());

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated.value) {
    return navigateTo("/login");
  }
});
