import { describe, expect, it } from "vitest";
import { borderRadiusCss, boxShadowCss, createPrompt, makeSvgShape, patternCss, socialCanvasDimensions, textShadowCss, typographyScale } from "@/lib/tools/algorithms";

describe("creative tool helpers", () => {
  it("builds a predictable modular type scale", () => {
    expect(typographyScale(16, 1.25, 3).map((step) => step.px)).toEqual([16, 20, 25]);
  });

  it("creates an editable SVG payload", () => {
    expect(makeSvgShape("polygon", 45, 5)).toContain("<polygon");
  });

  it("creates a CSS pattern without an external image", () => {
    expect(patternCss("grid", "#B83B4B", 24)).toContain("linear-gradient");
  });

  it("uses supplied creative constraints in a local prompt", () => {
    expect(createPrompt({ niche: "pôster", style: "editorial", colors: "vinho e creme", goal: "divulgar uma mostra", difficulty: "intermediário" }, 1)).toContain("pôster");
  });

  it("serializes visual CSS controls into usable declarations", () => {
    expect(textShadowCss({ x: 2, y: 3, blur: 4, color: "#B83B4B", opacity: 0.5 })).toBe("2px 3px 4px rgb(184 59 75 / 0.5)");
    expect(boxShadowCss([{ x: 2, y: 4, blur: 12, spread: 0, color: "#622E3B", opacity: 0.16, inset: false }])).toBe("2px 4px 12px 0px rgb(98 46 59 / 0.16)");
    expect(borderRadiusCss([4, 8, 12, 16])).toBe("4px 8px 12px 16px");
  });

  it("uses the correct canvas dimensions for social publishing formats", () => {
    expect(socialCanvasDimensions("square")).toEqual({ width: 1080, height: 1080, label: "1080 × 1080" });
    expect(socialCanvasDimensions("story")).toEqual({ width: 1080, height: 1920, label: "1080 × 1920" });
  });
});
