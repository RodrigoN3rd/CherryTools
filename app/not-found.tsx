import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function NotFound() {
  return <AppShell><div className="page"><p className="eyebrow">Página não encontrada</p><h1 className="display-title">Esse recorte<br /><em>não existe.</em></h1><p className="intro">Volte à estante para encontrar uma ferramenta que combine com sua ideia.</p><Link className="button button-primary" href="/">Ir para o início</Link></div></AppShell>;
}
