import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateBlogBody } from "@/lib/admin/blogValidation";
import { readBlogBody, revalidateBlog } from "@/lib/admin/blogRoute";
import { badRequest, isPrismaError } from "@/lib/admin/categoryRoute";
import { logger } from "@/lib/logging/logger";

const NOT_FOUND = { error: "Post not found. It may have been deleted." };

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await readBlogBody(request);
  if (!body) return badRequest("Request body must be valid JSON.");

  const result = validateBlogBody(body);
  if ("error" in result) return badRequest(result.error);

  try {
    // A slug change leaves the old URL cached, so remember it to revalidate too.
    const before = await db.blogPost.findUnique({ where: { id }, select: { slug: true } });
    const post = await db.blogPost.update({ where: { id }, data: result.fields });
    logger.info({ postId: post.id, slug: post.slug }, "admin updated a blog post");
    revalidateBlog(post.slug);
    if (before && before.slug !== post.slug) revalidateBlog(before.slug);
    return NextResponse.json({ post });
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return NextResponse.json(
        { error: `A post with slug "${result.fields.slug}" already exists.` },
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
    const post = await db.blogPost.delete({ where: { id } });
    logger.info({ postId: post.id, slug: post.slug }, "admin deleted a blog post");
    revalidateBlog(post.slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isPrismaError(error, "P2025")) return NextResponse.json(NOT_FOUND, { status: 404 });
    throw error;
  }
}
