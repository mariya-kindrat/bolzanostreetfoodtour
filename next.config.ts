import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  // Sentry DSNs are write-only ingest identifiers, safe to expose client-side.
  // Re-exposing it here (instead of a NEXT_PUBLIC_ prefix) keeps the env var
  // name identical across client, server, and edge configs.
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
};

export default withSentryConfig(nextConfig, {
  // org/project/authToken are omitted: source-map upload needs a Sentry auth
  // token, which requires dashboard access nobody running this build has yet.
  // Without them, Sentry still captures errors correctly, just with bundled
  // (not original TS) stack traces. Revisit once an auth token is issued.
  silent: !process.env.CI,
});
