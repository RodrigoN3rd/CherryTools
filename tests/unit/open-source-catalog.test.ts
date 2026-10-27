import { describe, expect, it } from "vitest";
import { getOpenSourceApp, openSourceApps, searchOpenSourceApps } from "@/lib/open-source/catalog";
import { tools } from "@/lib/tools/catalog";

describe("open source app catalog", () => {
  it("contains at least 30 uniquely identifiable, verified applications", () => {
    expect(openSourceApps.length).toBeGreaterThanOrEqual(30);
    expect(new Set(openSourceApps.map((app) => app.slug)).size).toBe(openSourceApps.length);
    expect(openSourceApps.every((app) => app.verification.status === "verified")).toBe(true);
  });

  it("keeps every download source official, HTTPS-only, and platform-scoped", () => {
    for (const app of openSourceApps) {
      expect(app.officialSite).toMatch(/^https:\/\//);
      expect(app.repository).toMatch(/^https:\/\//);
      expect(app.downloadSources.length).toBeGreaterThan(0);
      expect(app.downloadSources.every((source) => source.isOfficial && source.url.startsWith("https://") && source.platforms.length > 0)).toBe(true);
    }
  });

  it("finds applications by words in their name, category, and features", () => {
    expect(getOpenSourceApp("blender")?.name).toBe("Blender");
    expect(searchOpenSourceApps("modelagem 3d").some((app) => app.slug === "blender")).toBe(true);
    expect(searchOpenSourceApps("gravação de tela").some((app) => app.slug === "obs-studio")).toBe(true);
  });

  it("only relates catalog apps to Cherry tools that actually exist", () => {
    const toolSlugs = new Set(tools.map((tool) => tool.slug));
    expect(openSourceApps.flatMap((app) => app.relatedToolSlugs).every((slug) => toolSlugs.has(slug))).toBe(true);
  });
});
