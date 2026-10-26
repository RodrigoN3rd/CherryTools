import { describe, expect, it } from "vitest";
import { fitDimensions, quantizeChannel, sourceCrop } from "@/lib/tools/image";

describe("image tools", () => {
  it("preserves the image proportion when a width is supplied", () => {
    expect(fitDimensions({ width: 2400, height: 1600 }, { width: 1200, height: null, keepRatio: true })).toEqual({ width: 1200, height: 800 });
  });

  it("returns an integer color bucket", () => {
    expect(quantizeChannel(173, 4)).toBe(170);
  });

  it("converts percent-based crop values to source pixels", () => {
    expect(sourceCrop(1000, 800, { x: 10, y: 20, width: 50, height: 40 })).toEqual({ x: 100, y: 160, width: 500, height: 320 });
  });
});
