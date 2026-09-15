# Bolzano Street Food Tour — New Website Project: Handoff Summary

**Project:** Rebuild of https://www.bolzanostreetfoodtour.com/
**Stage completed so far:** Discovery — existing-site analysis, content inventory, photo sourcing guide.
**Stage not yet started:** Requirements definition, technical/architecture decisions, resolution of critical issues, build.

This document is a handoff summary so work can continue in a new environment (VS Code / Claude Code). It summarizes what was done, references the deliverables produced, and lists the open decisions/next steps.

---

## 1. What was done

### 1.1 Live site analysis
Crawled the entire existing site directly (via browser automation — every page, the booking widget, the cart/checkout flow, and a mobile-viewport test) rather than working from assumptions. Confirmed the site runs on **Wix**, using Wix Bookings (iframe-embedded booking/calendar/cart), Wix eCommerce checkout, Wix Blog, Wix Forms, and a separate third-party "Form Builder" app for the transfers quote form.

Produced: **`bolzanostreetfoodtour-site-analysis.md`**
Contents: full site map, page-by-page component breakdown (5 reusable templates: Homepage, Tour Detail, Catalog/Grid, Transfers, Blog), the tested booking→cart→3-step-checkout flow, the technology stack, and a list of concrete issues/risks found.

### 1.2 Full content inventory (for content mapping into the new site)
Extracted **every** piece of live content — all 12 bookable tour/class products (including 9 pages not linked from the main navigation), all 9 quote-only Winter Tours products, the Transfers rate/supplement tables, homepage section copy, About/Contact copy, the blog post list + tag cloud, and all repeated "global" content (trust block, cancellation policy, dietary disclaimer, contact details).

Produced: **`bolzanostreetfoodtour-content-inventory.xlsx`**
9 sheets: READ ME, Site Map, Bookable Tours, Winter Tours (Quote-Only), Transfers, Homepage Content, About & Contact, Blog Posts, Global & Reusable Content.

### 1.3 Photo library reference
Previewed real candidate images across 7 visual themes (Dolomites landscapes, Bolzano old town, South Tyrolean food, Christmas markets, wine road/vineyards, Alpe di Siusi alpine meadow, cable cars/Val Gardena) and compiled direct search links into free-to-use, commercial-license stock libraries (Unsplash/Pexels/Pixabay) per theme, since arbitrary web images can't legally or technically be bundled as ready-made files.

Produced: **`photo-library-reference-guide.md`**

---

## 2. Deliverable files (attach/copy these into the VS Code project)
| File | Purpose |
|---|---|
| `bolzanostreetfoodtour-site-analysis.md` | Structure, components, functionality, tech stack, and issues of the current site |
| `bolzanostreetfoodtour-content-inventory.xlsx` | All migratable content, ready to map into new CMS/page fields |
| `photo-library-reference-guide.md` | Curated, theme-organized links to source new photography |

---

## 3. Critical issues identified on the current site (not yet resolved — carry into requirements)
1. **Not mobile-responsive.** At a 390×844 mobile viewport, the site renders its ~980px desktop layout and overflows horizontally — no reflow, no hamburger menu. Should be a must-fix in the rebuild, not a nice-to-have.
2. **Two dead navigation tiles** on the homepage ("Group Tours," "Pop up Tours" — no href at all).
3. **One broken product link** — the "Tramin — Cradle of Gewürztraminer" wine tour card links to the homepage instead of its own page; that product's full copy could not be recovered (only the catalog teaser: price from €99/person, April–mid August, Mon–Sat).
4. **Inconsistent booking model across products**, with no clear stated logic: some products (3 flagship tours + all cooking classes + all wine tours) have live instant-book calendars; others (all 9 Winter Tours + two sections of Transfers) are "Contact us" quote-only. Needs a deliberate decision, not an accident of legacy content entry.
5. **9 real, content-complete product pages are orphaned** from primary navigation (only reachable via their catalog page's "More details" links) — an SEO/discoverability risk.
6. **Two different form technologies** in parallel use (native Wix Forms on Contact page; a separate third-party "Form Builder" app, explicitly on its free/unbranded tier, on the Transfers page) — inconsistent UX and doubled maintenance.
7. **Blog is stale** — last post October 2020, most content from 2017–2018. Needs a decision: commit to content operations, or retire/de-emphasize the blog in the new site.
8. **Minor copy inconsistencies** in the repeated "Why book with us" trust block — e.g., "min 2 max 10" vs. "min 2 max 12" passengers depending on the page (flagged row-by-row in the content inventory's Global & Reusable Content sheet).
9. **Footer copyright year is static** ("© 2017"), not dynamically generated.
10. **Booking widget is a black-box, cross-origin iframe** (Wix Bookings). Any rebuild needs an explicit decision: keep embedding a third-party booking engine (Wix Bookings, or an alternative like FareHarbor, Checkfront, Bókun, Regiondo, Rezdy/TrekkSoft) vs. build custom booking/availability/payment logic. This is the single biggest architectural decision for the rebuild and should be resolved early, since it affects almost everything else (CMS choice, hosting, payment processing, content modeling).

---

## 4. Not yet done / next steps
1. **Requirements gathering** — define target audience, business goals, must-have vs. nice-to-have features, and explicitly resolve item #10 above (booking engine strategy) plus a decision on each issue in §3.
2. **Technical/architecture decisions** — target stack (headless CMS + custom frontend vs. another website builder), hosting, booking/payments integration, whether to keep Wix or migrate off it entirely.
3. **Information architecture** — fix the orphaned-page problem, decide the online-bookable vs. quote-only split deliberately, resolve dead/broken links.
4. **Content finalization** — use the content inventory as the source of truth; get the client to supply fresh copy for the one unrecoverable product (Tramin tour) and decide the blog's fate.
5. **Visual design/branding** — source real on-location photography (guides, tasting stops, meeting points) to supplement/replace the stock-photo starting points in the photo library guide.
6. **Build**, QA (including mobile responsiveness testing from day one), and launch/migration plan (redirects from all current URLs, since several are indexed).

---

*Generated at the end of the discovery phase. Pick up from §4 next.*
