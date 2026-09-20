import { revalidatePath } from "next/cache";
import type { BlogBody } from "@/lib/admin/blogValidation";

/** Parses the request body; null when it is not valid JSON. */
export async function readBlogBody(request: Request): Promise<BlogBody | null> {
  try {
    return (await request.json()) as BlogBody;
  } catch {
    return null;
  }
}

// Blog pages are statically cached for an hour; invalidate everything a post
// change can touch so an admin edit shows up immediately.
export function revalidateBlog(slug: string): void {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog/tag/[tag]", "page");
  revalidatePath("/sitemap.xml");
}
