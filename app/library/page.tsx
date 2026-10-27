import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { OpenSourceLibrary } from "@/components/library/open-source-library";
import { openSourceApps } from "@/lib/open-source/catalog";

export const metadata: Metadata = {
  title: "Cherry Open Source Library",
  description: "Aplicativos criativos open source com licença, plataformas e destinos oficiais verificados.",
  alternates: { canonical: "/library" },
  openGraph: { title: "Cherry Open Source Library", description: "Descubra ferramentas criativas open source com origem clara." }
};

export default function LibraryPage() {
  return <AppShell><OpenSourceLibrary apps={openSourceApps} /></AppShell>;
}
