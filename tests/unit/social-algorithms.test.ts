import { describe, expect, it } from "vitest";
import { buildCaptionVariations, buildUtmUrl, isSafeExternalUrl, organizeHashtags } from "@/lib/social/algorithms";
import { socialFormats } from "@/lib/social/presets";

describe("social studio local rules", () => {
  it("keeps platform formats in a reusable preset catalog", () => {
    expect(socialFormats.instagramPortrait).toMatchObject({ width: 1080, height: 1350, platform: "Instagram" });
    expect(socialFormats.youtubeThumbnail.width).toBe(1280);
  });

  it("creates varied captions without an external model", () => {
    const captions = buildCaptionVariations({ niche: "beleza", tone: "acolhedor", goal: "ensinar", cta: "salve este post", length: "curta" });
    expect(captions).toHaveLength(3);
    expect(new Set(captions).size).toBe(3);
    expect(captions.every((caption) => caption.includes("salve este post"))).toBe(true);
  });

  it("normalizes hashtag groups and removes repetitions", () => {
    expect(organizeHashtags("#Design, design  #Criatividade\n#design")).toEqual(["#design", "#criatividade"]);
  });

  it("encodes UTM values while retaining existing parameters and fragments", () => {
    expect(buildUtmUrl("https://cherry.tools/guia?ref=home#top", { source: "instagram ads", medium: "social", campaign: "primavera" })).toBe("https://cherry.tools/guia?ref=home&utm_source=instagram+ads&utm_medium=social&utm_campaign=primavera#top");
  });

  it("only accepts navigable http links for public link pages", () => {
    expect(isSafeExternalUrl("https://example.com/path")).toBe(true);
    expect(isSafeExternalUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeExternalUrl("data:text/html,test")).toBe(false);
  });
});
