import * as Sentry from "@sentry/nuxt";

Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: useRuntimeConfig().public.sentryDsn,
});
