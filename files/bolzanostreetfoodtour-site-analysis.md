# Bolzano Street Food Tour — Existing Site Analysis & Documentation

**Source:** https://www.bolzanostreetfoodtour.com/
**Purpose:** Full structural/functional inventory of the current site, to serve as the baseline for the new website's requirements and plan.
**Platform detected:** Wix (Wix Editor, Wix Bookings, Wix eCommerce/Cart, Wix Blog, Wix Forms, plus a third-party "Form Builder" app embed)
**Analysis method:** Live crawl of every page via browser automation (Sept 2026 snapshot), including interaction testing of the booking/cart/checkout flow and a mobile-viewport test.

---

## 1. Site Map / Information Architecture

### 1.1 Primary navigation (present in header & footer on every page)
| Label | URL | Page type |
|---|---|---|
| Home | `/` | Homepage |
| Bolzano Street Food Tour (via "Tours" dropdown) | `/book-now` | Tour detail (bookable) |
| Trento Street Food Tour | `/trento-street-food-tour` | Tour detail (bookable) |
| Christmas Edition | `/christmas-markets` | Tour detail (bookable, seasonal) |
| Winter Tours | `/winter-tours` | Catalog/grid (quote-only) |
| Cooking Classes | `/cooking-classes` | Catalog/grid (quote-only) |
| Wine Tours | `/wine-tours` | Catalog/grid (quote-only) |
| Transfers | `/private-transfers` | Service page + quote form |
| About | `/about` | Static content |
| Contact | `/contact` | Contact form |
| Blog | `/blog` | Wix Blog app |

### 1.2 Orphan / hidden pages (not linked from main nav — only reachable via catalog "More details" links)
- `/farmhouse-private-cooking-class`
- `/south-tyrol-wine-road-cooking-class`
- `/hike-and-cheese-workshop`
- 6 wine-tour sub-pages linked from `/wine-tours` (South Tyrol Wine Road FD Tour, Caldaro Village & Wine Road HD, Bolzano Wine & More Walking Tour, Tramin Gewürztraminer HD Tour, Rooftops of Bolzano Walking Tour, Beers & Bites)

All of these use the same "Tour Detail" template described in §2.2, just with unique content.

### 1.3 Legal/utility pages (footer only)
- Privacy Policy
- Data Privacy Policy

---

## 2. Page-by-Page Breakdown

### 2.1 Homepage (`/`)
Sections top to bottom:
1. **Header** — logo, top utility bar (phone, social icons, email), primary nav.
2. **Hero** — full-bleed background image/slideshow, H1 "BOLZANO STREET FOOD TOUR®", tagline, two CTA buttons: "BOOK NOW" (→ `/book-now`) and "OUR TOURS" (→ anchor/tours section).
3. **Testimonial carousel** — quote-style rotating widget, 4 slides, prev/next arrows + dot pagination, each showing guest name/origin/date.
4. **"Why Bolzano & a Street Food Tour?"** — split image/text section, "READ MORE" link.
5. **"Discover Our Tours"** — 6-tile image grid linking to product categories:
   - Bolzano Street Food Tour® & Christmas Markets → `/christmas-markets` ✅ linked
   - Bolzano Street Food Tour® → `/book-now` ✅ linked
   - Cooking Classes → `/cooking-classes` ✅ linked
   - Wine Tours → `/wine-tours` ✅ linked
   - **Group Tours → ⚠️ NOT LINKED (dead tile, no href)**
   - **Pop up Tours → ⚠️ NOT LINKED (dead tile, no href)**
6. **"Bolzano — Gateway to the Dolomites"** — descriptive/marketing copy block.
7. **"Where is it?"** — geography/orientation copy + image, cross-sell mention of the Transfers page.
8. **"Why book with us?"** — 5-point trust/USP list with icons (secure bookings, licensed guides, guaranteed departures, multilingual private tours, eco-sustainable tourism).
9. **Newsletter signup** — email field + GDPR consent checkbox ("I agree to the privacy policy") + "SIGN-UP" button.
10. **Footer** — Contact block (email, phone, Privacy Policy, Data Privacy Policy links), Explore nav (duplicate of primary nav), Partner logos (6 local business logos), embedded **TripAdvisor widget** ("Bolzano Walks", 5-star, 72 reviews), copyright line ("© 2017 Bolzano Street Food Tour - Italy Destination Services LLC").

### 2.2 Tour Detail template (used by `/book-now`, `/trento-street-food-tour`, `/christmas-markets`, and all orphan sub-pages)
This is the core reusable component of the site. Structure:
1. **Hero** — background photo, title, frequency line ("Every day Monday to Saturday"), price line (adult/child), tour-type badge (e.g., "Semi-Private Tour" / "Private Tour").
2. **Quick-facts icon row** — Language, Offered on (days), Starting time, Duration, Meeting point, Group size (min/max). Icons + label + value.
3. **Tour Overview** — short marketing paragraph + "Learn more.." anchor link.
4. **Live booking widget (right-column, sticky)** — embedded third-party **Wix Bookings iframe** (cross-origin, not part of main page DOM):
   - Step 1: Date — interactive month calendar; **green = available, red = unavailable/sold out**, prev/next month arrows.
   - Step 2: Time — auto-populated time slot(s) once a date is picked.
   - Participant type selector — Adult / Child (4–12) / Infant (0–3), each with its own price and quantity `<select>`. **Business rule enforced in the UI itself: the Adult quantity dropdown skips "1" (jumps 0→2→3…), enforcing the stated minimum-2 group rule.**
   - Live "Grand Total" calculation as quantities change.
   - "Add to Shopping Cart" button.
5. **Highlights** — checklist of 3–4 bullet USPs specific to that tour.
6. **Meeting point** — address text + embedded **Google Maps** widget (with "Open in Maps" external link) + emergency phone number.
7. **Important information** — "Who should take it," "What's included," "What to wear," "Weather conditions," "Additional information" (dietary-accommodation disclaimer, contact email).
8. **"What to expect"** — two long-form subsections: "Authentic Food Tasting Experience" and "Historical and Cultural Experience."
9. **Cancellation policy** — tiered refund text (100% if ≥7 days, 50% if 3–6 days, 0% if <2 days).
10. **"Why book with us?"** — same trust block as homepage, repeated.

### 2.3 Catalog/Grid template (used by `/winter-tours`, `/cooking-classes`, `/wine-tours`)
1. Hero with category title + short intro copy + "DISCOVER OUR TOURS" anchor.
2. Descriptive intro paragraph(s) about the category.
3. **Card grid** — one card per product, each showing: price ("From €X/person"), date range validity, day-of-week availability, duration, title, 3–5 bullet inclusions, and a CTA:
   - Winter Tours cards → all CTA = **"contact us"** (no live booking; these are private/custom excursions requiring manual quote).
   - Cooking Classes & Wine Tours cards → CTA = **"More details"** link to a full Tour Detail page (§2.2), which *does* have the live booking widget.

This is an important distinction: **not all products are bookable online** — some categories are marketing pages that funnel to a manual inquiry process.

### 2.4 Private Transfers (`/private-transfers`)
Unique page — not a tour, a transport ancillary service.
1. Hero with "OUR TRANSFERS" / "REQUEST NOW" CTAs.
2. Bullet list of service features + bold "Please Note" restriction (transfers reserved for tour clients only, 72-hr advance booking required).
3. "Airport Transfers: What to expect" and "Hotel Transfers: What to expect" — two explanatory blocks with images.
4. **Rates table** — origin airport, max pax, max luggage, price (€), duration, for 7 airports (Malpensa, Linate, Venice, Verona, Bergamo, Munich, Innsbruck).
5. **Supplements table** — additional South Tyrol destinations and surcharge (Merano, Bressanone, Brunico, Alta Badia, Val Gardena, Vipiteno, Cortina).
6. Important information (inclusions/exclusions, night/holiday surcharges, extra-delay fee, porterage/tips excluded).
7. **"Ready to Book?" quote-request form** — embedded via a third-party "Form Builder" app (page footer literally states "This is a free version of the Form Builder app," confirming it is not a native Wix form and is running on a free/unbranded tier). Fields: transfer date, email, From (dropdown), To (dropdown), number of travelers, airline/flight/hotel info (textarea). Submits a request — no live pricing/instant confirmation.
8. "Group Transfers" and "Transfers within South Tyrol" sections, each with a "Contact us" CTA (separate from the form above).
9. Cancellation policy (72-hr no-fee window, then 100% penalty; no-show = full penalty).
10. "Why book with us?" trust block.

### 2.5 About (`/about`)
Single long-form narrative page: founder/team story, mission statement, language capabilities (English standard; Italian/German/Russian on request), sign-off, contact email. No structured components — plain text + hero image.

### 2.6 Contact (`/contact`)
1. Hero with page title.
2. "Get in touch" intro copy.
3. **Contact form** (native Wix Forms): Name*, Email*, Subject, Message, Submit button.
4. Contact details block: email, US toll-free number, Italy number.
5. Meeting-point walking directions from the train station (text only, no embedded map on this page).
6. Large decorative brand logo/mascot graphic.

### 2.7 Blog (`/blog`)
Wix Blog app, standard components:
- Hero banner.
- Recent Posts sidebar list (with thumbnails).
- Main post feed.
- **Archive** widget grouped by month (Oct 2020, May 2020, Apr 2020, Feb 2018, Dec 2017 ×2, Sep 2017 ×2 — **8 posts total**).
- **Search by Tags** — large tag cloud (~50 tags: Advent, Alto Adige, Christmas, Dolomites, Krampus, Törggelen, etc.).
- "Follow Us" social block.
- ⚠️ **Content is stale** — last post published October 2020; the majority of posts date from 2017–2018. Five+ years without a new post.

---

## 3. Cross-Site / Global Components

| Component | Notes |
|---|---|
| **Header** | Logo (links home), top contact bar (phone/social/email), primary nav with a "Tours" dropdown (Bolzano SFT, Trento SFT, Christmas Edition, Winter Tours, Cooking Classes, Wine Tours). Present identically on every page. Appears to scroll with page (not confirmed sticky/fixed on scroll — background hero image parallaxes under it). |
| **Footer** | Contact block, secondary nav ("Explore"), partner logos, TripAdvisor reviews widget, copyright. Identical on every page. |
| **Cookie consent banner** | Bottom-of-screen bar on first visit: "We use cookies…" with Settings / Accept buttons + Privacy Policy link. |
| **"Why book with us?" trust block** | Repeated verbatim on Home, every Tour Detail page, and Transfers. |
| **Google Maps embeds** | Used on tour-detail meeting-point sections. |
| **TripAdvisor widget** | Footer, shows live-ish review count/rating for "Bolzano Walks" listing (72 reviews at time of analysis). |
| **Newsletter signup (Wix-native)** | Homepage only. |
| **WhatsApp/phone/email contact info** | Repeated across nearly every page footer/header (phone: +39 366 227 6538, US toll-free 800-771-7756, email info@bolzanostreetfoodtour.com). |

---

## 4. Booking & Transaction Flow (tested live)

1. User lands on a Tour Detail page (§2.2).
2. Selects an available (green) date in the calendar → date confirms as text ("Monday, September 21st 2026") with an edit (pencil) icon.
3. Time slot auto-populates (single option observed: 10:00).
4. User sets participant quantities (Adult/Child/Infant) via `<select>` dropdowns; **Adult minimum enforced at 2** by the dropdown's available options; live "Grand Total" updates (e.g., 2 adults × €109 = €218.00).
5. Clicking "Add to Shopping Cart" with quantity still 0 triggers inline validation: **"Please select the quantity"** (red text).
6. Successful add opens an embedded **cart panel** in place of the widget: line item (tour name, date, time, qty × unit price), a "Redeem coupon code" expandable field, Grand Total incl. VAT, "Proceed to Checkout >>" and "Continue Shopping" buttons.
7. Checkout is a **3-step wizard** (visible step indicator: **Cart → Contact → Payment**):
   - **Contact step**: First name*, Last name*, Email*, Phone (with country-code selector, default +1), and a **tour-specific custom question** ("Please advise us of any dietary re[strictions]"), "Continue to payment »" button.
   - **Payment step**: not completed during this analysis (avoided entering real/fake payment data), but the wizard structure confirms a native Wix eCommerce checkout (likely card payment via Wix Payments/Stripe — exact processor not confirmed without completing a transaction).
8. The entire booking widget runs inside a **cross-origin iframe** — it is not part of the main page's DOM and is invisible to standard DOM/accessibility-tree tooling. This is architecturally significant: the widget is a self-contained third-party app (Wix Bookings), not custom code.

---

## 5. Technology Stack (inferred from live inspection)

| Layer | Technology |
|---|---|
| Website builder/CMS | **Wix** (classic Wix Editor site, not Wix Studio-generated markup) |
| Booking/scheduling | **Wix Bookings** app (iframe-embedded calendar + participant pricing + cart integration) |
| E-commerce/cart/checkout | **Wix eCommerce** (Cart → Contact → Payment wizard, coupon support, VAT display) |
| Blog | **Wix Blog** app (categories via tags, monthly archive, recent-posts widget) |
| Forms | **Wix Forms** (Contact page) **and** a separate third-party **"Form Builder" app** (free tier, unbranded notice visible) used specifically for the Transfers quote-request form — i.e., two different form technologies are in use on the same site |
| Maps | Embedded **Google Maps** iframes (tour meeting points) |
| Reviews | Embedded **TripAdvisor** widget (footer) |
| Newsletter | Native Wix newsletter/contact-list signup with GDPR consent checkbox |
| Hosting/domain | wix.com infrastructure under custom domain `bolzanostreetfoodtour.com`, HTTPS enabled |

---

## 6. Issues, Gaps & Risks Identified (to carry into requirements)

1. **⚠️ Not mobile-responsive.** Tested at a 390×844 (mobile) viewport: the page renders its full ~980px desktop-width layout and simply overflows, forcing horizontal scrolling; no hamburger menu or reflowed layout appears. This is a critical defect given tour/activity bookings skew heavily mobile — should be treated as a must-fix, not an enhancement, in the new build.
2. **Dead navigation tiles.** "Group Tours" and "Pop up Tours" tiles on the homepage have no href at all — clicking does nothing.
3. **Inconsistent booking model across products.** Some products (Bolzano SFT, Trento SFT, Christmas Edition, Cooking Classes, Wine Tours sub-pages) have live instant-book calendars; others (all Winter Tours, and the two "Contact us" sections on Transfers) are quote-only. This inconsistency should be an explicit, deliberate decision in the new IA, not an accident of legacy content entry.
4. **Orphaned pages.** Several real, content-complete tour pages (cooking classes, wine tours) are not reachable from primary navigation — only from within their catalog page. SEO and discoverability risk.
5. **Two different form technologies** (native Wix Forms + third-party Form Builder app) creates inconsistent UX/branding and doubles the maintenance surface.
6. **Stale blog.** No new content since October 2020; last substantial batch from 2017–18. Either commit to content operations in the new site or consider removing/de-emphasizing the blog.
7. **Templated "Why book with us?" block repeated site-wide** verbatim — fine as a pattern, but worth turning into a true reusable component (it currently reads as manually copy-pasted per page, based on minor micro-copy differences like "max 10" vs "max 12" passengers between pages).
8. **Booking widget is a black-box iframe.** Any migration must plan for either (a) continuing to embed Wix Bookings (or an equivalent third-party booking engine such as FareHarbor, Checkfront, Bókun, Regiondo, TrekkSoft/Peek, Rezdy), or (b) building custom booking/availability/payment logic — a major architectural decision for the rebuild.
9. **Copyright footer says "© 2017"** — not dynamically updated.

---

## 7. Content Inventory Summary (for migration planning)

- **3** directly bookable "flagship" tours (Bolzano SFT, Trento SFT, Christmas Edition)
- **9** additional bookable tour/class detail pages reachable only via catalog pages (3 cooking classes, 6 wine tours)
- **9** quote-only winter/private excursion products listed on `/winter-tours`
- **1** ancillary service (private transfers) with two rate tables and a custom quote form
- **8** blog posts across ~50 tags
- **~15** total unique page templates/instances once orphan pages are counted
- Multi-language claim: tours "offered on request" in Italian, German, Russian, French, Dutch (site UI itself is English-only — no language switcher observed)

---

*This document reflects a live snapshot taken via direct browser inspection. Ready to proceed to requirements gathering and the site rebuild plan based on this baseline.*
