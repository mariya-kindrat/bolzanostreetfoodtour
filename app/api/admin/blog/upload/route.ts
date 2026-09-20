import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { checkUpload } from "@/lib/admin/imageUpload";
import { badRequest } from "@/lib/admin/categoryRoute";
import { logger } from "@/lib/logging/logger";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return badRequest("Attach a photo to upload.");

  const check = checkUpload(file);
  if ("error" in check) return badRequest(check.error);

  const blob = await put(`blog/${Date.now()}.${check.extension}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });
  logger.info({ url: blob.url, bytes: file.size }, "admin uploaded a blog photo");
  return NextResponse.json({ url: blob.url });
}
