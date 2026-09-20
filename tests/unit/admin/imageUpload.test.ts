import { describe, expect, it } from "vitest";
import { checkUpload, MAX_UPLOAD_BYTES } from "@/lib/admin/imageUpload";

describe("checkUpload", () => {
  it("accepts jpeg, png and webp and returns the extension", () => {
    expect(checkUpload({ type: "image/jpeg", size: 1000 })).toEqual({ extension: "jpg" });
    expect(checkUpload({ type: "image/png", size: 1000 })).toEqual({ extension: "png" });
    expect(checkUpload({ type: "image/webp", size: 1000 })).toEqual({ extension: "webp" });
  });

  it("rejects other types", () => {
    expect(checkUpload({ type: "image/gif", size: 1000 })).toEqual({
      error: "Only JPEG, PNG or WebP photos are allowed.",
    });
    expect(checkUpload({ type: "application/pdf", size: 1000 })).toHaveProperty("error");
  });

  it("rejects an empty or oversize file, and accepts exactly the limit", () => {
    expect(checkUpload({ type: "image/jpeg", size: 0 })).toHaveProperty("error");
    expect(checkUpload({ type: "image/jpeg", size: MAX_UPLOAD_BYTES + 1 })).toEqual({
      error: "Photos must be 4 MB or smaller.",
    });
    expect(checkUpload({ type: "image/jpeg", size: MAX_UPLOAD_BYTES })).toEqual({
      extension: "jpg",
    });
  });
});
