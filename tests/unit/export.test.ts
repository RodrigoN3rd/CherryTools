import { describe, expect, it } from "vitest";
import { preferredWebmMime } from "@/lib/tools/export";

describe("visual export helpers", () => {
  it("prefers VP9 WebM when the browser supports it", () => {
    expect(preferredWebmMime((mime) => mime === "video/webm;codecs=vp9")).toBe("video/webm;codecs=vp9");
  });

  it("reports when no supported WebM encoder is available", () => {
    expect(preferredWebmMime(() => false)).toBeNull();
  });
});
