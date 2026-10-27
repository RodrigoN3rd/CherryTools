import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { OpenSourceAppDetail } from "@/components/library/open-source-app-detail";
import { getOpenSourceApp, openSourceApps } from "@/lib/open-source/catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return openSourceApps.map((app) => ({ slug: app.slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const app = getOpenSourceApp((await params).slug);
  if (!app) return {};
  return { title: `${app.name} — open source`, description: app.description, alternates: { canonical: `/library/${app.slug}` }, openGraph: { title: app.name, description: app.description } };
}

export default async function OpenSourceAppPage({ params }: PageProps) {
  const app = getOpenSourceApp((await params).slug);
  if (!app) notFound();
  return <AppShell><OpenSourceAppDetail app={app} /></AppShell>;
}
