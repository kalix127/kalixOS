import * as Sentry from "@sentry/nuxt";

Sentry.init({
  enabled: process.env.NODE_ENV === "production",
  environment: process.env.NODE_ENV,
  dsn: process.env.SENTRY_DSN,
});
