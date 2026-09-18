import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logging/logger";

interface ContactBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ContactBody;

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  const submission = await db.contactSubmission.create({
    data: { name: body.name, email: body.email, subject: body.subject, message: body.message },
  });

  logger.info(
    { submissionId: submission.id, email: body.email },
    "contact form submission captured",
  );

  return NextResponse.json({ ok: true });
}
