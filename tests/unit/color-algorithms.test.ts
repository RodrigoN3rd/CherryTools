import { describe, expect, it } from "vitest";
import { contrastRatio, hexToRgb, hslToHex, buildPalette } from "@/lib/tools/algorithms";

describe("color tools", () => {
  it("converts a six-digit HEX color to RGB", () => {
    expect(hexToRgb("#B83B4B")).toEqual({ r: 184, g: 59, b: 75 });
  });

  it("keeps a red hue when creating a fully saturated HSL color", () => {
    expect(hslToHex(0, 100, 50)).toBe("#FF0000");
  });

  it("reports the maximum WCAG contrast for black on white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBe(21);
  });

  it("creates five colors for a complementary palette", () => {
    expect(buildPalette("#B83B4B", "complementary")).toHaveLength(5);
  });
});
