import type { OpenSourceApp } from "./catalog";
import { getGitHubRepository, getLatestGitHubRelease, type LatestSoftwareRelease } from "./release-service";

export type ReleaseLookupResult =
  | { status: "disabled" }
  | { status: "unavailable" }
  | { status: "error" }
  | { status: "available"; release: LatestSoftwareRelease; cached: boolean };

type CacheEntry = { expiresAt: number; release: LatestSoftwareRelease };

type ReleaseLookupOptions = {
  enabled: boolean;
  token?: string;
  fetcher?: typeof fetch;
  now?: () => number;
  cache?: Map<string, CacheEntry>;
  onEvent?: (event: { event: "open_source_release_checked" | "open_source_release_failed"; slug: string; cached?: boolean }) => void;
};

const cacheTtlMs = 30 * 60 * 1_000;
const maxCachedRepositories = 50;

export function createReleaseLookup(options: ReleaseLookupOptions) {
  const cache = options.cache ?? new Map<string, CacheEntry>();
  const now = options.now ?? Date.now;
  return async (app: OpenSourceApp): Promise<ReleaseLookupResult> => {
    if (!options.enabled) return { status: "disabled" };
    const repository = getGitHubRepository(app.repository);
    if (!repository) return { status: "unavailable" };
    const key = `${repository.owner}/${repository.repository}`;
    const cached = cache.get(key);
    if (cached && cached.expiresAt > now()) {
      options.onEvent?.({ event: "open_source_release_checked", slug: app.slug, cached: true });
      return { status: "available", release: cached.release, cached: true };
    }
    try {
      const release = await getLatestGitHubRelease(repository, { fetcher: options.fetcher, token: options.token });
      if (cache.size >= maxCachedRepositories) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey) cache.delete(oldestKey);
      }
      cache.set(key, { release, expiresAt: now() + cacheTtlMs });
      options.onEvent?.({ event: "open_source_release_checked", slug: app.slug, cached: false });
      return { status: "available", release, cached: false };
    } catch {
      options.onEvent?.({ event: "open_source_release_failed", slug: app.slug });
      return { status: "error" };
    }
  };
}
