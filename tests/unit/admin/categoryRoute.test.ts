import { beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  badRequest,
  isPrismaError,
  readCategoryBody,
  revalidatePublicSite,
} from "@/lib/admin/categoryRoute";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

function prismaError(code: string) {
  return new Prisma.PrismaClientKnownRequestError("boom", { code, clientVersion: "test" });
}

describe("readCategoryBody", () => {
  it("returns the parsed JSON body", async () => {
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ slug: "wine-tours" }),
    });
    expect(await readCategoryBody(request)).toEqual({ slug: "wine-tours" });
  });

  it("returns null for a body that is not valid JSON", async () => {
    const request = new Request("http://localhost", { method: "POST", body: "{not json" });
    expect(await readCategoryBody(request)).toBeNull();
  });
});

describe("badRequest", () => {
  it("responds 400 with the error message", async () => {
    const response = badRequest("nope");
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "nope" });
  });
});

describe("isPrismaError", () => {
  it("matches a Prisma known-request error with the same code", () => {
    expect(isPrismaError(prismaError("P2025"), "P2025")).toBe(true);
  });

  it("does not match a different code", () => {
    expect(isPrismaError(prismaError("P2002"), "P2025")).toBe(false);
  });

  it("does not match a plain error", () => {
    expect(isPrismaError(new Error("boom"), "P2025")).toBe(false);
  });
});

describe("revalidatePublicSite", () => {
  beforeEach(() => vi.mocked(revalidatePath).mockClear());

  it("invalidates the whole site layout", () => {
    revalidatePublicSite();
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });
});
