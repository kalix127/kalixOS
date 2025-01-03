export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated } = storeToRefs(useGlobalStore());

  const allowedRoutes = ["/login", "/desktop", "/booting", "/poweroff", "/"];

  if (allowedRoutes.includes(to.path)) {
    return;
  }

  if (!isAuthenticated.value) {
    return navigateTo("/login", { redirectCode: 302 });
  } else {
    return navigateTo("/desktop", { redirectCode: 302 });
  }
});
