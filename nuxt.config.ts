// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  app: {
    head: {
      bodyAttrs: {
        class: "dark",
      },
    },
  },
  devtools: { enabled: true },
  runtimeConfig: {
    mailtrapEndpoint: process.env.MAILTRAP_ENDPOINT,
    mailtrapSender: process.env.MAILTRAP_SENDER,
    mailtrapPassword: process.env.MAILTRAP_PASSWORD,
    mailtrapTemplateUuidResetPassword:
      process.env.MAILTRAP_TEMPLATE_UUID_RESET_PASSWORD,
    mailtrapTemplateUuidVerifyEmail:
      process.env.MAILTRAP_TEMPLATE_UUID_VERIFY_EMAIL,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "shadcn-nuxt",
    "@nuxt/fonts",
    "@pinia/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  icon: {
    serverBundle: {
      collections: [
        "material-symbols",
        "lucide",
        "ic",
        "mdi",
        "ion",
        "svg-spinners",
      ],
    },
    clientBundle: {
      scan: true,
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
        name: "Inter",
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
});
