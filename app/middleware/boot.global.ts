export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isBooting } = storeToRefs(useBootStore());

  const bootingPages = ["/booting", "/poweroff", "/"];

  // Prevent the user from going into the booting pages if the system is not booting
  if (bootingPages.includes(to.path) && !isBooting.value) {
    return navigateTo("/login");
  }
});