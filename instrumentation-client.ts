import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// Instruments client-side router navigations for performance tracing.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
