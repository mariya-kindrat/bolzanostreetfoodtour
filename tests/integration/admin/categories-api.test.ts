import { afterEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { POST } from "@/app/api/admin/categories/route";
import { PATCH, DELETE } from "@/app/api/admin/categories/[id]/route";

// revalidatePath needs a running Next.js request context, so it is mocked
// here and asserted on instead.
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

// Route handlers are called directly (not over HTTP), the same way
// lib/availability/hold.ts's integration tests exercise real Postgres
// without a running server — this also means these tests never go through
// middleware.ts's Clerk check, so they're free to run without Clerk
// configured, same as every other integration test in this project.

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/admin/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    slug: `test-category-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: "Test Category",
    description: "A category created by an integration test.",
    photoUrl: "/images/tours/wine-tour-hero.jpg",
    altText: "Test alt text",
    ...overrides,
  };
}

describe("POST /api/admin/categories", () => {
  const createdIds: string[] = [];
  afterEach(async () => {
    await db.category.deleteMany({ where: { id: { in: createdIds.splice(0) } } });
  });

  it("creates a category and returns it", async () => {
    const body = validBody();
    const res = await POST(jsonRequest(body));
    expect(res.status).toBe(200);
    const data = (await res.json()) as { category: { id: string; slug: string } };
    createdIds.push(data.category.id);
    expect(data.category.slug).toBe(body.slug);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("returns 400 for a reserved slug", async () => {
    const res = await POST(jsonRequest(validBody({ slug: "tours" })));
    expect(res.status).toBe(400);
  });

  it("returns 400 for a remote photo URL", async () => {
    const res = await POST(jsonRequest(validBody({ photoUrl: "https://example.com/x.jpg" })));
    expect(res.status).toBe(400);
  });

  it("returns 400, not 500, for a malformed JSON body", async () => {
    const res = await POST(
      new Request("http://localhost/api/admin/categories", { method: "POST", body: "{not json" }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when a required field is missing", async () => {
    const res = await POST(jsonRequest(validBody({ name: undefined })));
    expect(res.status).toBe(400);
  });

  it("returns 409 with a friendly message on a duplicate slug", async () => {
    const body = validBody();
    const first = await POST(jsonRequest(body));
    const firstData = (await first.json()) as { category: { id: string } };
    createdIds.push(firstData.category.id);

    const second = await POST(jsonRequest(body));
    expect(second.status).toBe(409);
    const data = (await second.json()) as { error: string };
    expect(data.error).toContain(body.slug);
  });
});

describe("PATCH /api/admin/categories/[id]", () => {
  const createdIds: string[] = [];
  afterEach(async () => {
    await db.category.deleteMany({ where: { id: { in: createdIds.splice(0) } } });
  });

  async function createTestCategory() {
    const res = await POST(jsonRequest(validBody()));
    const data = (await res.json()) as { category: { id: string; slug: string } };
    createdIds.push(data.category.id);
    return data.category;
  }

  it("updates a category's fields", async () => {
    const category = await createTestCategory();
    const res = await PATCH(jsonRequest(validBody({ slug: category.slug, name: "Renamed" })), {
      params: Promise.resolve({ id: category.id }),
    });
    expect(res.status).toBe(200);
    const data = (await res.json()) as { category: { name: string } };
    expect(data.category.name).toBe("Renamed");
  });

  it("returns 400 when a required field is missing", async () => {
    const category = await createTestCategory();
    const res = await PATCH(jsonRequest(validBody({ slug: category.slug, photoUrl: undefined })), {
      params: Promise.resolve({ id: category.id }),
    });
    expect(res.status).toBe(400);
  });

  it("returns 409 when updated to a slug another category already uses", async () => {
    const a = await createTestCategory();
    const b = await createTestCategory();
    const res = await PATCH(jsonRequest(validBody({ slug: a.slug })), {
      params: Promise.resolve({ id: b.id }),
    });
    expect(res.status).toBe(409);
  });
});

describe("missing category", () => {
  const MISSING = { params: Promise.resolve({ id: "does-not-exist" }) };

  it("PATCH returns 404 when the category no longer exists", async () => {
    const res = await PATCH(jsonRequest(validBody()), MISSING);
    expect(res.status).toBe(404);
  });

  it("DELETE returns 404 when the category no longer exists", async () => {
    const res = await DELETE(new Request("http://localhost"), MISSING);
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/admin/categories/[id]", () => {
  it("deletes a category with no tours assigned", async () => {
    const created = await POST(jsonRequest(validBody()));
    const data = (await created.json()) as { category: { id: string } };

    const res = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ id: data.category.id }),
    });
    expect(res.status).toBe(200);
    expect(await db.category.findUnique({ where: { id: data.category.id } })).toBeNull();
  });

  it("returns 409 with a friendly message when tours are still assigned (FK restrict)", async () => {
    // wine-tours is seeded with real tours — a real, not fabricated,
    // exercise of the onDelete: Restrict constraint.
    const wineTours = await db.category.findFirstOrThrow({ where: { slug: "wine-tours" } });
    const res = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ id: wineTours.id }),
    });
    expect(res.status).toBe(409);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/tours/i);
    // Confirm it's genuinely still there, not accidentally deleted before
    // the assertion above.
    expect(await db.category.findUnique({ where: { id: wineTours.id } })).not.toBeNull();
  });
});
