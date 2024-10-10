import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated } = storeToRefs(useGlobalStore());

  // If the user is not authenticated, redirect to the login page
  if (to.path !== "/login" && !isAuthenticated.value) {
    return navigateTo("/login");
  }

  // If the user is authenticated, redirect to the home page
  if (to.path === "/login" && isAuthenticated.value) {
    return navigateTo("/");
  }
});
