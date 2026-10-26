import { describe, expect, it } from "vitest";
import { categories, tools } from "@/lib/tools/catalog";

describe("tool catalog", () => {
  it("ships the 20 announced tools with unique routes", () => {
    expect(tools).toHaveLength(20);
    expect(new Set(tools.map((tool) => tool.slug)).size).toBe(20);
  });

  it("keeps every tool in one of the five discoverable categories", () => {
    expect(new Set(tools.map((tool) => tool.category))).toEqual(new Set(categories.map((category) => category.id)));
  });
});
