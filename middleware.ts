import { clerkMiddleware } from "@clerk/nextjs/server";

// Only /admin is Clerk-protected. Scoping the matcher down to it (rather
// than every route) keeps the public marketing site free of any runtime
// dependency on Clerk being configured/reachable.
export default clerkMiddleware(async (auth) => {
  await auth.protect();
});

export const config = {
  // Explicit /admin/(.*) (not a bare /admin(.*) glob) so this only matches
  // /admin and its sub-paths, not any future public route whose slug merely
  // starts with "admin" (e.g. /admin-tips).
  matcher: ["/admin", "/admin/(.*)"],
};
