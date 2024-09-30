// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon"],
  css: ["~/assets/css/main.css"],
  icon: {
    serverBundle: {
      collections: [],
    },
    clientBundle: {
      scan: true,
    },
  },
});
