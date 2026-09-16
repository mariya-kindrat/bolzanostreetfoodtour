# Routes and Components

## Routes

| Route | File | Auth | Notes |
|---|---|---|---|
| `/` | `app/(marketing)/page.tsx` | none | Placeholder home page (Task 1 scaffold). |
| `/admin` | `app/admin/page.tsx` | Clerk (required) | Placeholder admin home. Gated by `middleware.ts` — later admin pages under `app/admin/**` inherit this auth without adding per-page logic. |

## Middleware

`middleware.ts` runs `clerkMiddleware()` and calls `auth.protect()` for any route
matching `/admin(.*)`. Unauthenticated requests are redirected to Clerk's hosted
sign-in page. `ClerkProvider` is likewise scoped to `app/admin/layout.tsx` rather
than the root layout, so the public marketing site has no runtime dependency on
Clerk being configured or reachable.

## Components

None yet beyond the route files above. This section grows as `components/` is
populated in later phases.
