// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  app: {
    head: {
      htmlAttrs: {
        class: "overflow-hidden"
      }
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      serverName: process.env.SERVER_NAME,
      socialUrl: {
        linkedin: process.env.SOCIAL_LINKEDIN_URL,
        github: process.env.SOCIAL_GITHUB_URL,
        twitter: process.env.SOCIAL_TWITTER_URL,
      },
    },
    mailtrapEndpoint: process.env.MAILTRAP_ENDPOINT,
    mailtrapSender: process.env.MAILTRAP_SENDER,
    mailtrapPassword: process.env.MAILTRAP_PASSWORD,
    mailtrapTemplateUuidResetPassword:
      process.env.MAILTRAP_TEMPLATE_UUID_RESET_PASSWORD,
    mailtrapTemplateUuidVerifyEmail:
      process.env.MAILTRAP_TEMPLATE_UUID_VERIFY_EMAIL,
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
  i18n: {
    // TODO: Add baseUrl for prod
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
        dir: "./icons/app",
        prefix: "app",
      },
      {
        dir: "./icons/file",
        prefix: "file",
      },
      {
        dir: "./icons/folder",
        prefix: "folder",
      },
      {
        dir: "./icons/logo",
        prefix: "logo",
      },
      {
        dir: "./icons/gnome",
        prefix: "gnome"
      },
      {
        dir: "./icons/extra",
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
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
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
    storesDirs: ["./stores/**"],
  },
  image: {
    format: ["webp"],
  },
});
