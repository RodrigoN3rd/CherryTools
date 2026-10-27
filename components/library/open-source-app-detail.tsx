import Link from "next/link";
import { ChevronLeft, ExternalLink, ShieldCheck } from "lucide-react";
import { appCategories, type OpenSourceApp } from "@/lib/open-source/catalog";
import { getTool } from "@/lib/tools/catalog";

export function OpenSourceAppDetail({ app }: { app: OpenSourceApp }) {
  return <div className="app-detail">
    <div className="tool-topline"><Link className="crumb" href="/library"><ChevronLeft size={15} /> Biblioteca de apps</Link><span className="eyebrow">Origem verificada em {new Intl.DateTimeFormat("pt-BR").format(new Date(`${app.verification.verifiedAt}T12:00:00Z`))}</span></div>
    <header className="app-detail__header"><div><p className="eyebrow">{app.categories.map((category) => appCategories.find((item) => item.id === category)?.name).join(" · ")}</p><h1>{app.name}</h1><p>{app.description}</p></div><div className="app-detail__license"><ShieldCheck size={20} /><b>{app.license.spdx}</b><span>{app.license.name}</span></div></header>
    <div className="app-detail__grid">
      <section className="panel"><h2>O que ele oferece</h2><ul className="detail-list">{app.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
      <section className="panel"><h2>Plataformas</h2><p className="platform-list">{app.platforms.join(" · ")}</p><p className="mini-note">A seleção de plataforma é informativa: confira os requisitos no destino oficial antes de instalar.</p></section>
      <section className="panel app-detail__downloads"><h2>Downloads oficiais</h2><p className="panel-help">Você sai do Cherry Tools para a fonte indicada pelo próprio projeto.</p>{app.downloadSources.map((source) => <a className="button button-primary" href={source.url} target="_blank" rel="noreferrer" key={source.url}>Abrir download oficial <ExternalLink size={15} /></a>)}</section>
      <section className="panel"><h2>Projeto e documentação</h2><div className="detail-links"><a href={app.officialSite} target="_blank" rel="noreferrer">Site oficial <ExternalLink size={14} /></a><a href={app.repository} target="_blank" rel="noreferrer">Repositório oficial <ExternalLink size={14} /></a>{app.documentation ? <a href={app.documentation} target="_blank" rel="noreferrer">Documentação <ExternalLink size={14} /></a> : null}</div></section>
      <section className="panel app-detail__related"><h2>Ferramentas Cherry relacionadas</h2><div className="related-links">{app.relatedToolSlugs.map((slug) => { const tool = getTool(slug); return tool ? <Link href={`/tools/${tool.slug}`} key={tool.slug}>{tool.name}</Link> : null; })}</div></section>
    </div>
  </div>;
}
