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

const NOT_FOUND = { error: "Category not found. It may have been deleted." };

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await readCategoryBody(request);
  if (!body) return badRequest("Request body must be valid JSON.");

  const result = validateCategoryBody(body);
  if ("error" in result) return badRequest(result.error);

  try {
    const category = await db.category.update({ where: { id }, data: result.fields });
    logger.info({ categoryId: category.id, slug: category.slug }, "admin updated a category");
    revalidatePublicSite();
    return NextResponse.json({ category });
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return NextResponse.json(
        { error: `A category with slug "${result.fields.slug}" already exists.` },
        { status: 409 },
      );
    }
    if (isPrismaError(error, "P2025")) return NextResponse.json(NOT_FOUND, { status: 404 });
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const category = await db.category.delete({ where: { id } });
    logger.info({ categoryId: category.id, slug: category.slug }, "admin deleted a category");
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch (error) {
    // The Tour.categoryId foreign key is onDelete: Restrict - a category with
    // tours still assigned can't be deleted, so surface a real message.
    if (isPrismaError(error, "P2003")) {
      return NextResponse.json(
        {
          error:
            "This category still has tours assigned to it. Reassign or remove those tours first.",
        },
        { status: 409 },
      );
    }
    if (isPrismaError(error, "P2025")) return NextResponse.json(NOT_FOUND, { status: 404 });
    throw error;
  }
}
