import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdminEmail, parseAdminEmails } from "@/lib/admin/adminAccess";

// Only /admin is Clerk-protected. Scoping the matcher down to it (rather
// than every route) keeps the public marketing site free of any runtime
// dependency on Clerk being configured/reachable.
//
// Being signed in is not enough: any Clerk user could otherwise sign up and
// use the admin. The user must also have a VERIFIED email listed in
// ADMIN_EMAILS; an unset or empty list denies everyone (fail closed).
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth.protect();
  const user = await (await clerkClient()).users.getUser(userId);
  const verifiedEmails = user.emailAddresses
    .filter((email) => email.verification?.status === "verified")
    .map((email) => email.emailAddress);

  if (!isAdminEmail(verifiedEmails, parseAdminEmails(process.env.ADMIN_EMAILS))) {
    // The admin forms read { error } from API responses, so give them JSON.
    const message = "This account is not allowed to use the admin.";
    return req.nextUrl.pathname.startsWith("/api/")
      ? NextResponse.json({ error: message }, { status: 403 })
      : new NextResponse(message, { status: 403 });
  }
});

export const config = {
  // Explicit /admin/(.*) and /api/admin/(.*) (not bare /admin(.*)/
  // /api/admin(.*) globs) so this only matches /admin and its sub-paths —
  // including the admin API routes categories CRUD (and future admin
  // mutations) live under — not any future public route whose slug merely
  // starts with "admin" (e.g. /admin-tips).
  matcher: ["/admin", "/admin/(.*)", "/api/admin/(.*)"],
};
