// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  app: {
    head: {},
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
        "fa6-solid",
      ],
    },
    clientBundle: {
      icons: [
        "material-symbols:person",
        "material-symbols:arrow-right",
        "material-symbols:arrow-left",
        "material-symbols:bluetooth",
        "material-symbols:volume-off",
        "material-symbols:volume-down",
        "material-symbols:volume-up",
        "mdi:eye",
        "mdi:eye-off",
        "mdi:battery-charging",
        "ion:airplane-sharp",
        "ion:md-arrow-round-back",
        "ion:arrow-forward-outline",
        "ic:baseline-signal-wifi-1-bar",
        "ic:baseline-signal-wifi-1-bar-lock",
        "ic:baseline-signal-wifi-2-bar",
        "ic:baseline-signal-wifi-2-bar-lock",
        "ic:baseline-signal-wifi-3-bar",
        "ic:baseline-signal-wifi-3-bar-lock",
        "ic:baseline-signal-wifi-4-bar",
        "ic:baseline-signal-wifi-4-bar-lock",
        "ic:outline-check",
        "lucide:ethernet-port",
        "fa6-solid:power-off",
        "svg-spinners:tadpole",
        "svg-spinners:ring-resize",
      ],
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
