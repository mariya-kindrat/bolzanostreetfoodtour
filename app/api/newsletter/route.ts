import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logging/logger";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: string };

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  await db.newsletterSubscriber.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  logger.info({ email }, "newsletter signup captured");

  return NextResponse.json({ ok: true });
}
