import { clerkMiddleware } from "@clerk/nextjs/server";

// Only /admin is Clerk-protected. Scoping the matcher down to it (rather
// than every route) keeps the public marketing site free of any runtime
// dependency on Clerk being configured/reachable.
export default clerkMiddleware(async (auth) => {
  await auth.protect();
});

export const config = {
  // Explicit /admin/(.*) and /api/admin/(.*) (not bare /admin(.*)/
  // /api/admin(.*) globs) so this only matches /admin and its sub-paths —
  // including the admin API routes categories CRUD (and future admin
  // mutations) live under — not any future public route whose slug merely
  // starts with "admin" (e.g. /admin-tips).
  matcher: ["/admin", "/admin/(.*)", "/api/admin/(.*)"],
};
