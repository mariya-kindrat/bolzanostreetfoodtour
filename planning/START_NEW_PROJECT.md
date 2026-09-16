# How This Project Went From Idea to CLAUDE.md/PLAN.md — A Reusable Playbook

This documents the actual stages this project (a website rebuild) went through, from a
one-line request to two finished planning documents (`CLAUDE.md`, `PLAN.md`), including
the clarifying questions asked at each stage. Reuse this as a checklist for the next
project — the stage list generalizes beyond website rebuilds; only the specific
questions inside each stage are domain-specific and need adapting.

**How to reuse:** work through the stages in order. At each stage, ask yourself (or have
Claude ask you) the category of question shown, adapted to the new project's domain.
Don't skip a stage just because it feels obvious — several "obvious" answers here
(e.g. "of course keep the same booking split") turned out to be wrong once examined.

---

## Stage 0 — Discovery (before any requirements conversation)

If replacing or rebuilding something that already exists, gather ground truth before
asking a single requirements question. Opinions formed without this are guesses.

For this project, three artifacts were produced up front:
1. **Structural/functional analysis** of the existing system — crawled the live site
   page by page, tested the actual booking/checkout flow, tested mobile viewport,
   identified the tech stack and every issue/dead-link/inconsistency found.
2. **Full content inventory** — every piece of live copy, pricing, and structured data,
   extracted into a spreadsheet so nothing gets lost or re-typed from memory during the
   rebuild.
3. **Asset sourcing guide** — since arbitrary web images can't legally be reused, a
   curated list of legitimately-licensed sourcing options per visual theme.

**Generalized checklist for Stage 0 on a new project:**
- What does the current system actually do (not what anyone remembers/assumes it does)?
- What content/data must migrate, and where does it live today?
- What assets (images, docs, brand material) exist, and what's their license/reuse status?
- What's actually broken today? (List it — this becomes the "must-fix" seed list for
  requirements, not an afterthought.)

---

## Stage 1 — Classify the Work and Announce It

Before asking anything else, classify the request: a quick spike/feasibility check, a
bounded change to something that already exists, or an architectural/new-build effort.
This project was **architectural** (new system, no existing flow to modify) — say so out
loud so the human can correct the classification if it's wrong. The classification
determines how much process follows: architectural work gets the full stage list below;
a bounded change gets a much shorter conversation (context, a few questions, a short
design in chat, then straight to implementation — no plan document).

---

## Stage 2 — Requirements Q&A, One Topic Per Step

This was the bulk of the work: numbered steps, each covering one topic, with the human
either answering multiple-choice questions or writing free-form requirements that the
assistant then asked clarifying follow-ups on. **Order matters** — later steps built on
earlier decisions (e.g. the booking-architecture decision in step 1 changed the shape of
every later step).

The actual steps used, in order, with the category of question asked at each:

1. **Core architecture decision** — the one choice that changes everything downstream
   (here: build custom booking/payments vs. embed a SaaS vs. no online booking at all).
   Identify this decision explicitly before anything else; don't let it happen by default.
2. **Tech stack** — language/framework, and *why* (team familiarity beat "best practice"
   here — ask what the human already knows before recommending something unfamiliar).
3. **Database & hosting** — paired decision, usually has a natural default once the
   framework is picked.
4. **Payment/transaction processor** (if applicable) — pick the one with the best SDK
   support for the chosen stack, not just the most popular.
5. **Content/data management** — who edits content after launch, and how (custom admin
   panel vs. headless CMS vs. code-only)? This determines the entire data model.
6. **Environments & infrastructure basics** — how many environments, how they map to
   branches, local dev setup (Docker or not), where databases live.
7. **Authentication** (if there's a private/admin area) — managed auth service vs.
   self-hosted, sized to the actual number of users (a service built for public-facing
   auth may be overkill or exactly right for a handful of internal accounts).
8. **Design direction** — see Stage 3 below; this deserves its own visual sub-process,
   not just a text question.
9. **Content structure / information architecture** — full page/content inventory
   mapped into the new structure, explicitly fixing every issue found in Stage 0 (dead
   links, orphaned pages, inconsistent copy) rather than carrying them forward by default.
10. **Core domain/transaction flow** — for this project, booking and availability logic;
    for another domain this might be an order flow, a subscription flow, a matching
    algorithm. Whatever the central "thing this system does" is, give it its own
    dedicated, detailed step — don't let it get compressed into a single question.
11. **Admin/back-office functionality** — deliberately kept as its **own** step, separate
    from the domain-flow step, because "what the system does for customers" and "what
    the system does for the people running it" have different shapes and different
    risk profiles (the admin side mutates real business data).
12. **SEO & analytics** — tool choices, and explicitly decide whether ad-conversion
    tracking is in scope (it changes the cookie/consent story).
13. **Deployment & CI/CD** — branching model, required checks, error monitoring.
14. **Legal/compliance/privacy** — cookie consent (re-derive whether it's actually
    needed given the analytics/tracking choices made above, don't just default to
    "add a banner"), accessibility target, legal page consolidation.
15. **Performance & scalability** — rendering strategy, and explicit handling for any
    high-risk feature (here: a 3D animation accent needed a defined fallback story for
    low-end devices *before* being approved, not after).
16. **Testing & QA strategy** — coverage bar, release gate (does CI passing alone promote
    to prod, or is there a manual review step?), and a QA plan specifically targeting
    whatever the Stage 0 discovery found as the worst existing defect (here: mobile).
17. **Monitoring & maintenance** — alerting channels, automated dependency updates,
    who/how gets notified of real-world events (new orders, form submissions, etc.).
18. **Anything the human adds unprompted** — don't assume the numbered list is complete.
    In this project, three more requirements surfaced after the "numbered steps" were
    done: end-to-end structured logging, an AI agent feature (with its own sub-round of
    scoping questions — provider, capability boundaries, and a safety model for any
    action that mutates data), and a mandatory code-review-after-every-step workflow
    rule. Keep asking "anything else?" until the answer is genuinely no.

**How each question was actually asked:** multiple-choice with a clearly labeled
recommendation and *why*, using a question tool that lets the human pick an option or
write a free-form correction. When the human's answer implied more nuance than the
options captured (e.g. "yes to the first option, but also X"), that nuance was folded
into the decision rather than discarded to keep the tidy multiple-choice shape.

---

## Stage 3 — Design Direction Gets Its Own Visual Sub-Process

Text descriptions of "modern," "clean," or "distinctive" design are close to meaningless
without seeing something. For any project with a real UI:

1. Offer a visual companion tool (if available) rather than only describing options in
   text — but only once a genuinely visual question comes up, not upfront.
2. Present 3-4 *distinct* directions (not minor variations) as visual mockups/mood
   boards, each with a clear name, color palette, and one-line description of the *feel*,
   not just a list of hex codes.
3. Get an explicit pick.
4. Immediately follow up on any tension in the original request (here: "editorial and
   calm" vs. "animations and 3D" are in tension) with a second visual question that
   resolves the tension explicitly (a motion-intensity spectrum, calibrated to the
   chosen direction) rather than letting both requirements sit unreconciled.

---

## Stage 4 — Write the Documents

Once every stage above has an explicit decision (not a default, not an assumption), write:

- **CLAUDE.md** — the standing instructions for whoever (human or agent) builds this:
  tech stack, environments, folder structure, coding standards, testing bar, the
  domain's core business rules, and any recurring workflow rule (e.g. "code review after
  every step"). This is the *rulebook*.
- **PLAN.md** — the build roadmap. For a project too large for one flat task list, this
  is a **phase roadmap** (each phase has a goal, a scope list, and a concrete
  deliverable), explicitly stating that each phase gets its own detailed, bite-sized
  task plan generated right before that phase starts — don't try to write 200 granular
  TDD steps for a multi-month project in one sitting; decompose instead. This is the
  *route*.
- Everything decided-but-deferred (a piece of content that couldn't be recovered, a
  redirect map that depends on a future launch date, a decision explicitly punted to
  "later") gets its own visible section in one of these two documents — never silently
  dropped.

---

## Anti-Patterns Observed (avoid repeating)

- Answering a design question in prose when a mockup would settle it in one click.
- Letting one requirement (e.g. "add animations") silently override an earlier one
  (e.g. "calm editorial feel") instead of surfacing the tension as its own question.
- Treating "admin panel" and "customer-facing flow" as one requirements step — they have
  different stakeholders and different risk levels and deserve separate steps.
- Writing a single mega-plan document with granular steps for an entire multi-phase
  project instead of a roadmap + per-phase detailed plans.
- Deciding something (like a cookie banner) by default/habit instead of re-deriving it
  from the actual choices made earlier (e.g. whether tracking cookies are even in use).
