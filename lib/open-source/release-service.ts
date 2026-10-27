export type GitHubRepository = { owner: string; repository: string };

export type SoftwareReleaseAsset = { name: string; url: string };

export type LatestSoftwareRelease = {
  version: string;
  publishedAt?: string;
  notes?: string;
  releaseUrl: string;
  assets: SoftwareReleaseAsset[];
};

type ReleaseLookupOptions = {
  fetcher?: typeof fetch;
  token?: string;
  signal?: AbortSignal;
};

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isNonEmptyString = (value: unknown, maxLength = 500): value is string => typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;

function isSafeHttpsUrl(value: unknown): value is string {
  if (!isNonEmptyString(value, 2_000)) return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

export function getGitHubRepository(repositoryUrl: string): GitHubRepository | null {
  try {
    const url = new URL(repositoryUrl);
    const segments = url.pathname.split("/").filter(Boolean);
    if (url.protocol !== "https:" || url.hostname !== "github.com" || segments.length !== 2) return null;
    const [owner, repository] = segments;
    if (!/^[A-Za-z0-9_.-]{1,100}$/.test(owner) || !/^[A-Za-z0-9_.-]{1,100}$/.test(repository)) return null;
    return { owner, repository };
  } catch { return null; }
}

export function parseGitHubRelease(payload: unknown): LatestSoftwareRelease | null {
  if (!isRecord(payload) || !isNonEmptyString(payload.tag_name, 100) || !isSafeHttpsUrl(payload.html_url)) return null;
  const assets = Array.isArray(payload.assets) ? payload.assets.flatMap((asset) => {
    if (!isRecord(asset) || !isNonEmptyString(asset.name, 250) || !isSafeHttpsUrl(asset.browser_download_url)) return [];
    return [{ name: asset.name, url: asset.browser_download_url }];
  }).slice(0, 50) : [];
  return {
    version: payload.tag_name,
    ...(isNonEmptyString(payload.published_at, 50) ? { publishedAt: payload.published_at } : {}),
    ...(isNonEmptyString(payload.body, 32_000) ? { notes: payload.body } : {}),
    releaseUrl: payload.html_url,
    assets
  };
}

export async function getLatestGitHubRelease(repository: GitHubRepository, options: ReleaseLookupOptions = {}): Promise<LatestSoftwareRelease> {
  const fetcher = options.fetcher ?? fetch;
  const headers: Record<string, string> = { accept: "application/vnd.github+json", "x-github-api-version": "2026-03-10" };
  if (options.token) headers.authorization = `Bearer ${options.token}`;
  const response = await fetcher(`https://api.github.com/repos/${repository.owner}/${repository.repository}/releases/latest`, { headers, signal: options.signal });
  if (!response.ok) throw new Error(`GitHub release lookup failed with status ${response.status}`);
  const release = parseGitHubRelease(await response.json());
  if (!release) throw new Error("GitHub release response did not match the expected schema");
  return release;
}
