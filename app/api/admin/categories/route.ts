import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateCategoryBody } from "@/lib/admin/categoryValidation";
import {
  badRequest,
  isPrismaError,
  readCategoryBody,
  revalidatePublicSite,
} from "@/lib/admin/categoryRoute";
import { logger } from "@/lib/logging/logger";

export async function POST(request: Request) {
  const body = await readCategoryBody(request);
  if (!body) return badRequest("Request body must be valid JSON.");

  const result = validateCategoryBody(body);
  if ("error" in result) return badRequest(result.error);

  try {
    const category = await db.category.create({ data: result.fields });
    logger.info({ categoryId: category.id, slug: category.slug }, "admin created a category");
    revalidatePublicSite();
    return NextResponse.json({ category });
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return NextResponse.json(
        { error: `A category with slug "${result.fields.slug}" already exists.` },
        { status: 409 },
      );
    }
    throw error;
  }
}
