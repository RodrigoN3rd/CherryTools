import { describe, expect, it, vi } from "vitest";
import { getGitHubRepository, getLatestGitHubRelease, parseGitHubRelease } from "@/lib/open-source/release-service";

describe("open source release service", () => {
  it("only derives a GitHub repository from an official github.com URL", () => {
    expect(getGitHubRepository("https://github.com/godotengine/godot")).toEqual({ owner: "godotengine", repository: "godot" });
    expect(getGitHubRepository("https://gitlab.com/inkscape/inkscape")).toBeNull();
    expect(getGitHubRepository("https://github.com/godotengine/godot/issues")).toBeNull();
  });

  it("allows only a minimal, HTTPS-safe release shape from GitHub", () => {
    expect(parseGitHubRelease({ tag_name: "v4.5", html_url: "https://github.com/godotengine/godot/releases/tag/4.5", published_at: "2026-10-01T12:00:00Z", body: "Notes", assets: [{ name: "Godot.zip", browser_download_url: "https://github.com/godotengine/godot/releases/download/4.5/Godot.zip" }] })).toEqual({ version: "v4.5", publishedAt: "2026-10-01T12:00:00Z", notes: "Notes", releaseUrl: "https://github.com/godotengine/godot/releases/tag/4.5", assets: [{ name: "Godot.zip", url: "https://github.com/godotengine/godot/releases/download/4.5/Godot.zip" }] });
    expect(parseGitHubRelease({ tag_name: "v4.5", html_url: "javascript:alert(1)", assets: [] })).toBeNull();
  });

  it("sends an optional server token to GitHub without returning it", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ tag_name: "v4.5", html_url: "https://github.com/godotengine/godot/releases/tag/4.5", assets: [] }), { status: 200 }));
    await expect(getLatestGitHubRelease({ owner: "godotengine", repository: "godot" }, { fetcher, token: "secret-token" })).resolves.toMatchObject({ version: "v4.5" });
    expect(fetcher).toHaveBeenCalledWith("https://api.github.com/repos/godotengine/godot/releases/latest", expect.objectContaining({ headers: expect.objectContaining({ authorization: "Bearer secret-token" }) }));
  });
});
