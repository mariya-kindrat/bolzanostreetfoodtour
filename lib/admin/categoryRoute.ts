import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma/client";
import type { CategoryBody } from "@/lib/admin/categoryValidation";

/** Parses the request body; null when it is not valid JSON. */
export async function readCategoryBody(request: Request): Promise<CategoryBody | null> {
  try {
    return (await request.json()) as CategoryBody;
  } catch {
    return null;
  }
}

export function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

/** True for a Prisma known-request error with the given code (e.g. "P2025"). */
export function isPrismaError(error: unknown, code: string): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

// Categories feed the layout (nav), homepage hero, /categories, catalog and
// tour pages, all statically cached for an hour - invalidate the lot so an
// admin change shows up immediately.
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
}
