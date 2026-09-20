import { describe, expect, it } from "vitest";
import { fitWithin } from "@/lib/admin/imageFit";

describe("fitWithin", () => {
  it("leaves an image alone when it already fits", () => {
    expect(fitWithin(1600, 900, 2000)).toEqual({ width: 1600, height: 900 });
  });

  it("scales a wide image so the long edge equals the max", () => {
    expect(fitWithin(4000, 3000, 2000)).toEqual({ width: 2000, height: 1500 });
  });

  it("scales a tall image so the long edge equals the max", () => {
    expect(fitWithin(3000, 6000, 2000)).toEqual({ width: 1000, height: 2000 });
  });

  it("never returns a zero dimension", () => {
    expect(fitWithin(10000, 1, 2000).height).toBe(1);
  });
});
