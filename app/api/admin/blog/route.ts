import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateBlogBody } from "@/lib/admin/blogValidation";
import { readBlogBody, revalidateBlog } from "@/lib/admin/blogRoute";
import { badRequest, isPrismaError } from "@/lib/admin/categoryRoute";
import { logger } from "@/lib/logging/logger";

export async function POST(request: Request) {
  const body = await readBlogBody(request);
  if (!body) return badRequest("Request body must be valid JSON.");

  const result = validateBlogBody(body);
  if ("error" in result) return badRequest(result.error);

  try {
    const post = await db.blogPost.create({ data: result.fields });
    logger.info(
      { postId: post.id, slug: post.slug, published: post.publishedAt !== null },
      "admin created a blog post",
    );
    revalidateBlog(post.slug);
    return NextResponse.json({ post });
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return NextResponse.json(
        { error: `A post with slug "${result.fields.slug}" already exists.` },
        { status: 409 },
      );
    }
    throw error;
  }
}
