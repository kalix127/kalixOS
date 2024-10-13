import { useGlobalStore } from "@/stores/global.store";
import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isBooting } = storeToRefs(useGlobalStore());

  const bootingPages = ["/booting", "/poweroff", "/"];

  // Prevent the user from going into the booting pages if the system is not booting
  if (bootingPages.includes(to.path) && !isBooting.value) {
    return navigateTo("/login");
  }
});