# Blog CMS: admin-managed posts with photos (BSFT-72)

Status: approved by the project owner in chat on 2026-09-20; awaiting written-spec review.

## Goal

Make blog posts more impactful (cover photos, inline photos, excerpt, tags, byline, reading
time) and let the site owner create, edit, publish and delete posts, with photo upload, from
the admin panel, without a developer. Pulls Phase 4 ticket 4.8 (BSFT-72) forward and extends
it with photos and richer content.

## Decisions (from the brainstorm)

- **Body format:** Markdown with an "Add photo" button that inserts uploaded photos, plus a
  live preview. Not a WYSIWYG editor, not a fixed layout.
- **Photo storage:** Vercel Blob (already named in `planning/PLAN.md`, Phase 4). The owner
  creates one Blob store per environment and enters `BLOB_READ_WRITE_TOKEN` personally.
- **Optional extras:** tags, a byline, reading time. No related-tour link.
- **Byline:** the author is always the site owner, so there is no per-post author field. One
  constant `BLOG_AUTHOR` in `lib/content/global.ts` holds the name; it ships as a clearly
  marked placeholder until the owner supplies the real name.

## Non-goals

- Per-post author, multiple authors, comments, scheduling beyond a publish date.
- Tracking or deleting Blob files when a post or photo is removed (orphans are negligible on
  the free tier; documented, not built).
- Rewriting the 8 migrated posts. Their bodies remain the migration placeholder until the
  owner writes real copy in the new admin (existing open item).
- A WYSIWYG editor, image cropping tools, or draft autosave.

## Data model

`BlogPost` gains, via one Prisma migration (all additive, existing rows unaffected):

| Field | Type | Notes |
|---|---|---|
| `excerpt` | `String?` | Short summary for cards and SEO description. |
| `coverImageUrl` | `String?` | Blob URL of the cover photo. |
| `coverImageAlt` | `String?` | Required whenever `coverImageUrl` is set. |
| `tags` | `String[]` | Lowercase-trimmed labels; default empty. |

`content` is now Markdown. `publishedAt = null` remains "draft" (unchanged rule; an
unpublished post is not publicly reachable). Reading time is computed from `content`
(about 200 words per minute, minimum 1 minute) and never stored.

The 8 migrated posts keep working: no excerpt means no excerpt shown, no cover means the
existing typographic card is used.

## Admin

All under the existing Clerk-protected `/admin` (`middleware.ts`), following the categories
CRUD conventions (native form + `fetch` to route handlers, `lib/admin/*Validation.ts`, Pino
log line per mutation, `revalidatePath` on success).

Pages:

- `/admin/blog`: table of posts (title, Draft/Published badge, date, Edit, Delete). Linked
  from the admin home.
- `/admin/blog/new` and `/admin/blog/[id]/edit`: one shared `BlogPostForm`.

Form fields: title; slug (auto-filled from the title until edited, unique, lowercase
hyphenated, the word `tag` reserved because `/blog/tag/[tag]` exists); excerpt; tags
(comma-separated); cover photo (upload button, preview, required alt text); Markdown body
with an "Add photo" button (uploads, then inserts `![alt](url)` at the cursor) and a live
preview pane; a Published toggle with a date (defaults to now when first published).

Route handlers:

- `POST /api/admin/blog`: create.
- `PATCH /api/admin/blog/[id]`, `DELETE /api/admin/blog/[id]`.
- `POST /api/admin/blog/upload`: accepts one image (JPEG, PNG or WebP, at most 4 MB),
  stores it in Vercel Blob with a random suffix, returns `{ url }`.

Photo handling: the browser downscales to a maximum of 2000 px on the long edge and
re-encodes before upload, keeping requests under Vercel's 4.5 MB body limit. The upload
route re-validates type and size server-side and never trusts the client.

Validation (`lib/admin/blogValidation.ts`, unit-tested): title and slug required, slug
format and reserved words, tag normalisation (trim, lowercase, dedupe, at most 8, each at
most 30 characters), alt text required with a cover, excerpt at most 300 characters,
`coverImageUrl` and inline image URLs must point at the configured Blob host.

## Public site

- **Markdown rendering:** `react-markdown` (raw HTML is not rendered by default, so
  admin-authored text is safe) with `remark-gfm`. Custom components map headings, lists,
  quotes, links and images to the existing type styles; images render through `next/image`.
  `next.config.ts` gains an `images.remotePatterns` entry for the Blob host.
- **Post page:** full-width cover band when a cover exists (otherwise today's plain
  header), then tags, the byline (`BLOG_AUTHOR`), reading time and month; a 42rem reading
  column; "Back to the blog"; "More stories".
- **Listing:** cards show the cover photo and excerpt when present and fall back to the
  typographic card otherwise. The newest post stays the wide featured card. A tag filter
  row links to static `/blog/tag/[tag]` pages (`generateStaticParams` from published posts).
- **SEO:** post `description` uses the excerpt, else the first 155 characters of the body;
  `og:image` uses the cover when present. Published posts are already in `app/sitemap.ts`;
  the new `/blog/tag/[tag]` pages are added to it.

## Testing

Unit tests first (Vitest): slugify, reserved slugs, tag normalisation, reading time,
validation, and the Markdown image-host check. Route-handler tests with the database and
`@vercel/blob` mocked: create, update, delete, duplicate-slug (409), oversize or wrong-type
upload (400), unauthenticated access is rejected by middleware (existing behaviour, not
re-tested). Playwright covers public rendering of a seeded post with a cover and tags, the
tag pages, and the fallback card; admin browser flows stay skipped in CI until the Clerk
testing token exists, as for categories. Coverage stays at or above the 80% gate.

## Build order

1. Data model, validation and admin CRUD with text only (no photos). Owner can try it.
2. Photo upload (Blob route, client downscale, cover and inline insert).
3. Public redesign around photos and the new fields, tag pages, SEO.

Each step is code-reviewed and committed under BSFT-72 on branch `phase-4-blog-cms`, then
merged to `dev` when the whole feature is done.

## Owner actions and configuration

- Create a Vercel Blob store for dev and for prod; enter `BLOB_READ_WRITE_TOKEN` in Vercel
  and `.env.local`. Agents add the variable name to `.env.example` only. Needed at step 2.
- Supply the byline name to replace the placeholder in `BLOG_AUTHOR`.
- Supply real copy for the 8 migrated posts (or retire them) before launch.

## Documentation (same PR as the code)

`docs/architecture.md` (Blog CMS and upload flow), `docs/infrastructure.md` (Blob store,
env var), `docs/routes-and-components.md` (all new admin and public routes and components),
`README.md` (a short blog section in the admin guide), and `.env.example`.

## Risks

- Vercel request body limit (4.5 MB): mitigated by client downscaling plus server checks.
- Markdown from a compromised admin account: mitigated by no raw HTML rendering and a Blob
  host allow-list for images.
- Orphaned Blob files after deletes: accepted and documented.
