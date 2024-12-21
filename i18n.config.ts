import en from "./app/locales/en-US.json";
import it from "./app/locales/it-IT.json";

export default defineI18nConfig(() => ({
  strategy: "no_prefix",
  locales: ["en-US", "it-IT"],
  defaultLocale: "en-US",
  messages: {
    "en-US": en,
    "it-IT": it,
  },
}));
