export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated } = storeToRefs(useGlobalStore());

  // If the user is authenticated, redirect to the desktop page
  if (isAuthenticated.value) {
    return navigateTo("/desktop");
  }
});
