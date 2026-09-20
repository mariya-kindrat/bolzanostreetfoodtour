import { beforeEach, describe, expect, it, vi } from "vitest";
import { put } from "@vercel/blob";
import { POST } from "@/app/api/admin/blog/upload/route";

vi.mock("@vercel/blob", () => ({
  put: vi.fn(async () => ({ url: "https://abc.public.blob.vercel-storage.com/blog/1-x.jpg" })),
}));

beforeEach(() => vi.clearAllMocks());

function uploadRequest(file?: File) {
  const form = new FormData();
  if (file) form.append("file", file);
  return new Request("http://localhost/api/admin/blog/upload", { method: "POST", body: form });
}

describe("POST /api/admin/blog/upload", () => {
  it("stores a valid photo publicly with a random suffix and returns its url", async () => {
    const file = new File(["img"], "kitchen.jpg", { type: "image/jpeg" });
    const res = await POST(uploadRequest(file));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      url: "https://abc.public.blob.vercel-storage.com/blog/1-x.jpg",
    });
    expect(put).toHaveBeenCalledWith(
      expect.stringMatching(/^blog\/\d+\.jpg$/),
      expect.any(File),
      expect.objectContaining({
        access: "public",
        addRandomSuffix: true,
        contentType: "image/jpeg",
      }),
    );
  });

  it("returns 400 when no file is attached", async () => {
    const res = await POST(uploadRequest());
    expect(res.status).toBe(400);
    expect(put).not.toHaveBeenCalled();
  });

  it("returns 400 for a disallowed type without calling Blob", async () => {
    const res = await POST(uploadRequest(new File(["x"], "a.gif", { type: "image/gif" })));
    expect(res.status).toBe(400);
    expect(put).not.toHaveBeenCalled();
  });
});
