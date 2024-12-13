export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated } = storeToRefs(useGlobalStore());

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated.value) {
    return navigateTo("/login");
  }
});


