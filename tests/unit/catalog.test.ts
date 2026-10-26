import { describe, expect, it } from "vitest";
import { categories, tools } from "@/lib/tools/catalog";

describe("tool catalog", () => {
  it("ships the 35 announced tools with unique routes", () => {
    expect(tools).toHaveLength(35);
    expect(new Set(tools.map((tool) => tool.slug)).size).toBe(35);
    expect(tools.map((tool) => tool.slug)).toEqual(expect.arrayContaining([
      "google-font-explorer",
      "variable-font-axis-studio",
      "typographic-poster",
      "text-outline-studio",
      "monogram-generator",
      "text-on-a-path",
      "quote-card-generator",
      "kinetic-typography-loop",
      "layout-grid-generator",
      "button-studio",
      "glass-surface-generator",
      "mesh-gradient-generator",
      "hero-composer",
      "device-mockup-generator",
      "organic-background-loop"
    ]));
  });

  it("keeps every tool in one of the five discoverable categories", () => {
    expect(new Set(tools.map((tool) => tool.category))).toEqual(new Set(categories.map((category) => category.id)));
  });
});
