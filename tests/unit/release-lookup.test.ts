import { describe, expect, it, vi } from "vitest";
import { createReleaseLookup } from "@/lib/open-source/release-lookup";
import type { OpenSourceApp } from "@/lib/open-source/catalog";

const githubApp = { slug: "godot", repository: "https://github.com/godotengine/godot" } as OpenSourceApp;

describe("catalog release lookup", () => {
  it("does not call remote services until catalog sync is explicitly enabled", async () => {
    const fetcher = vi.fn();
    const lookup = createReleaseLookup({ enabled: false, fetcher });
    await expect(lookup(githubApp)).resolves.toEqual({ status: "disabled" });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("keeps an official GitHub response in a bounded cache", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ tag_name: "v4.5", html_url: "https://github.com/godotengine/godot/releases/tag/4.5", assets: [] }), { status: 200 }));
    const lookup = createReleaseLookup({ enabled: true, fetcher, now: () => 1_000 });
    await expect(lookup(githubApp)).resolves.toMatchObject({ status: "available", release: { version: "v4.5" }, cached: false });
    await expect(lookup(githubApp)).resolves.toMatchObject({ status: "available", release: { version: "v4.5" }, cached: true });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("does not guess a release for catalog entries without an official GitHub repository", async () => {
    const lookup = createReleaseLookup({ enabled: true });
    await expect(lookup({ ...githubApp, repository: "https://gitlab.com/inkscape/inkscape" })).resolves.toEqual({ status: "unavailable" });
  });
});
