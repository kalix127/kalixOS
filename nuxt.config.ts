export default defineNuxtConfig({
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
  devtools: { enabled: true },
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
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      portfolioUrl: process.env.PORTFOLIO_URL,
      repositoryUrl: process.env.SOCIAL_REPOSITORY_URL,
      githubUrl: process.env.SOCIAL_GITHUB_URL,
      linkedinUrl: process.env.SOCIAL_LINKEDIN_URL,
      twitterUrl: process.env.SOCIAL_TWITTER_URL,
      redditUrl: process.env.SOCIAL_REDDIT_URL,
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2024-04-03",
  fonts: {
    families: [
      {
        name: "Noto Sans",
        provider: "google",
      },
    ],
  },
  i18n: {
    vueI18n: "./i18n.config.ts",
  },
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
    serverBundle: "local",
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
      sizeLimitKb: 256,
    },
  },
  image: {
    format: ["webp"],
  },
  pinia: {
    storesDirs: ["./app/stores/**"],
  },

  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  zodI18n: {
    useModuleLocale: false,
  },
});
