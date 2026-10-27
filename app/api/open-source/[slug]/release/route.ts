import { getOpenSourceApp } from "@/lib/open-source/catalog";
import { createReleaseLookup } from "@/lib/open-source/release-lookup";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const releaseLookup = createReleaseLookup({
  enabled: process.env.OPEN_SOURCE_CATALOG_SYNC_ENABLED === "true",
  token: process.env.GITHUB_TOKEN
});

type RouteProps = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: RouteProps) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const app = getOpenSourceApp((await params).slug);
  const headers = { "cache-control": "private, max-age=0, must-revalidate", "x-request-id": requestId };
  if (!app) return Response.json({ error: { code: "NOT_FOUND", message: "Aplicativo não encontrado" } }, { status: 404, headers });
  const result = await releaseLookup(app);
  console.info(JSON.stringify({ event: "open_source_release_request", requestId, slug: app.slug, status: result.status, ...(result.status === "available" ? { cached: result.cached } : {}) }));
  return Response.json({ data: result }, { headers });
}
