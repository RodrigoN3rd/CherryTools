import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ToolWorkspace } from "@/components/tool-workspace";
import { getTool, tools } from "@/lib/tools/catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return tools.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = getTool((await params).slug);
  if (!tool) return {};
  return { title: tool.name, description: tool.description, keywords: tool.keywords };
}

export default async function ToolPage({ params }: PageProps) {
  const tool = getTool((await params).slug);
  if (!tool) notFound();
  return <AppShell><div className="tool-page"><div className="tool-topline"><Link className="crumb" href="/"><ChevronLeft size={15} /> Todas as ferramentas</Link><span className="eyebrow">{tool.eyebrow}</span></div><header className="tool-heading"><h1>{tool.name}</h1><p>{tool.description} Sem criar uma conta e sem transferir seus arquivos para um servidor.</p></header><ToolWorkspace tool={tool} /></div></AppShell>;
}
