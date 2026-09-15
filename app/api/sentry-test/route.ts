import { logger } from "@/lib/logging/logger";

export async function GET() {
  logger.info({ route: "/api/sentry-test" }, "handling sentry test request");
  throw new Error("Sentry test error from /api/sentry-test");
}
