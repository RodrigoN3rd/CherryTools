import { describe, expect, it } from "vitest";
import { categories, tools } from "@/lib/tools/catalog";

describe("tool catalog", () => {
  it("ships the 55 announced tools with unique routes", () => {
    expect(tools).toHaveLength(55);
    expect(new Set(tools.map((tool) => tool.slug)).size).toBe(55);
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

  it("keeps every tool in one of the discoverable categories", () => {
    expect(new Set(tools.map((tool) => tool.category))).toEqual(new Set(categories.map((category) => category.id)));
  });

  it("registers twenty dedicated Social Studio tools", () => {
    const socialTools = tools.filter((tool) => tool.category === "social");
    expect(socialTools).toHaveLength(20);
    expect(socialTools.map((tool) => tool.slug)).toEqual(expect.arrayContaining([
      "carousel-maker",
      "social-image-resizer",
      "thumbnail-studio",
      "instagram-grid-preview",
      "story-designer",
      "social-safe-zone-checker",
      "caption-generator",
      "hashtag-organizer",
      "content-calendar",
      "brand-kit-creator",
      "link-in-bio-builder",
      "qr-code-generator",
      "watermark-studio",
      "utm-link-builder",
      "post-mockup-generator",
      "text-overlay-generator",
      "social-content-idea-generator",
      "media-kit-builder",
      "meme-quote-maker",
      "content-checklist-generator"
    ]));
  });
});
