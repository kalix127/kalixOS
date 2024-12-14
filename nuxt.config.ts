export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  future: {
    compatibilityVersion: 4,
  },
  app: {
    head: {
      htmlAttrs: {
        class: "overflow-hidden",
        lang: "en",
      },
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      socialUrl: {
        linkedin: process.env.SOCIAL_LINKEDIN_URL,
        github: process.env.SOCIAL_GITHUB_URL,
      },
    },
  },
  modules: [
    "nuxt-zod-i18n",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@pinia/nuxt",
    "@nuxt/image",
    "@nuxtjs/i18n",
  ],
  components: {
    dirs: [
      {
        path: "~/components/desktop/app/settings",
        prefix: "Settings",
      },
      {
        path: "~/components/desktop/app/files",
        prefix: "Files",
      },
      "~/components",
    ],
  },
  i18n: {
    defaultLocale: "en-US",
    lazy: true,
    langDir: "locales",
    strategy: "no_prefix",
    locales: [
      {
        code: "en-US",
        file: "en-US.json",
      },
      {
        code: "it-IT",
        file: "it-IT.json",
      },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n",
      redirectOn: "root",
    },
  },
  zodI18n: {
    useModuleLocale: false,
  },
  css: ["~/assets/css/main.css"],
  icon: {
    customCollections: [
      {
        dir: "./app/icons/app",
        prefix: "app",
      },
      {
        dir: "./app/icons/file",
        prefix: "file",
      },
      {
        dir: "./app/icons/folder",
        prefix: "folder",
      },
      {
        dir: "./app/icons/logo",
        prefix: "logo",
      },
      {
        dir: "./app/icons/gnome",
        prefix: "gnome",
      },
      {
        dir: "./app/icons/extra",
        prefix: "extra",
      },
    ],
    serverBundle: false,
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
      sizeLimitKb: 256,
    },
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  fonts: {
    families: [
      {
        name: "Comfortaa",
        provider: "google",
      },
      {
        name: "Noto Sans",
        provider: "google",
      },
    ],
  },
  pinia: {
    storesDirs: ["./app/stores/**"],
  },
  image: {
    format: ["webp"],
  },
});
