import * as Sentry from "@sentry/nuxt";

Sentry.init({
  enabled: process.env.NODE_ENV === "production",
  environment: process.env.NODE_ENV,
  dsn: process.env.SENTRY_DSN,
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", process.env.SERVER_NAME || ""],
  allowUrls: ["localhost", process.env.SERVER_NAME || ""],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
