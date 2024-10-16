import * as Sentry from "@sentry/nuxt";

Sentry.init({
  environment: process.env.NODE_ENV,
  dsn: useRuntimeConfig().public.sentryDsn,
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", useRuntimeConfig().public.serverName],
  allowUrls: ["localhost", useRuntimeConfig().public.serverName],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
