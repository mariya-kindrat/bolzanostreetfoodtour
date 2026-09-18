// Shared by both admin category API routes (create and update) — defined
// once so a future field addition can't silently diverge between the two
// (CLAUDE.md: never redeclare the same shape in two places).
export interface CategoryBody {
  slug?: string;
  name?: string;
  description?: string;
  photoUrl?: string;
  altText?: string;
  sortOrder?: number;
  isActive?: boolean;
  isBookable?: boolean;
}

export interface ValidatedCategoryFields {
  slug: string;
  name: string;
  description: string;
  photoUrl: string;
  altText: string;
  sortOrder: number;
  isActive: boolean;
  isBookable: boolean;
}

// Category pages live at the site root (/[categorySlug]), so a slug equal to
// any other top-level route would be shadowed by it (or shadow it).
const RESERVED_SLUGS = new Set([
  "about",
  "admin",
  "api",
  "blog",
  "categories",
  "contact",
  "legal",
  "photo-credits",
  "private-transfers",
  "robots.txt",
  "sitemap.xml",
  "style-guide",
  "tours",
]);

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export type CategoryValidation = { fields: ValidatedCategoryFields } | { error: string };

// Pure validation - no I/O, unit-tested. A malformed sortOrder (e.g. a
// non-numeric string sent directly to the API, bypassing CategoryForm's own
// number input) falls back to 0 rather than writing NaN.
export function validateCategoryBody(body: CategoryBody): CategoryValidation {
  if (!body.slug || !body.name || !body.description || !body.photoUrl || !body.altText) {
    return { error: "Slug, name, description, photo URL, and alt text are required." };
  }
  if (!SLUG_PATTERN.test(body.slug)) {
    return { error: "Slug may only contain lowercase letters, digits, and single hyphens." };
  }
  if (RESERVED_SLUGS.has(body.slug)) {
    return { error: `"${body.slug}" is reserved for another page. Choose a different slug.` };
  }
  // Only site-local images are allowed: next/image has no remote host
  // configured, so a full URL would throw at render and take down the
  // homepage and /categories.
  if (!body.photoUrl.startsWith("/") || body.photoUrl.startsWith("//")) {
    return { error: "Photo URL must be a site path starting with a single slash." };
  }
  const sortOrder = Number(body.sortOrder);
  return {
    fields: {
      slug: body.slug,
      name: body.name,
      description: body.description,
      photoUrl: body.photoUrl,
      altText: body.altText,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      isActive: body.isActive ?? true,
      isBookable: body.isBookable ?? true,
    },
  };
}
