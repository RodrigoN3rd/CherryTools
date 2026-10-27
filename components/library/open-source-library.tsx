"use client";

import Link from "next/link";
import { ExternalLink, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { appCategories, type AppCategory, type OpenSourceApp, type SoftwarePlatform } from "@/lib/open-source/catalog";

const platforms: Array<{ id: SoftwarePlatform; label: string }> = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
  { id: "android", label: "Android" },
  { id: "web", label: "Web" }
];

const matches = (app: OpenSourceApp, query: string, category: AppCategory | "", platform: SoftwarePlatform | "") => {
  const words = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim().split(/\s+/).filter(Boolean);
  const searchable = [app.name, app.description, ...app.features, ...app.categories].join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
  return (!category || app.categories.includes(category)) && (!platform || app.platforms.includes(platform)) && words.every((word) => searchable.includes(word));
};

export function OpenSourceLibrary({ apps }: { apps: OpenSourceApp[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<AppCategory | "">("");
  const [platform, setPlatform] = useState<SoftwarePlatform | "">("");
  const filtered = useMemo(() => apps.filter((app) => matches(app, query, category, platform)), [apps, category, platform, query]);

  return (
    <div className="library-page">
      <section className="library-hero" aria-labelledby="library-title">
        <p className="eyebrow">Descoberta com origem clara</p>
        <h1 id="library-title" className="display-title">Cherry Open<br /><em>Source Library</em></h1>
        <p className="intro">Uma estante curada de aplicativos livres para criar. Cada card identifica licença, plataformas e encaminha somente para a origem oficial.</p>
      </section>

      <section className="library-toolbar" aria-label="Filtros da biblioteca">
        <label className="library-search" htmlFor="library-search"><Search size={17} /><span>Buscar aplicativos</span><input id="library-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex.: modelagem 3D, captura…" /></label>
        <label className="library-filter" htmlFor="library-category"><SlidersHorizontal size={15} /><span>Categoria</span><select id="library-category" value={category} onChange={(event) => setCategory(event.target.value as AppCategory | "")}><option value="">Todas</option>{appCategories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
        <label className="library-filter" htmlFor="library-platform"><span>Sistema operacional</span><select id="library-platform" value={platform} onChange={(event) => setPlatform(event.target.value as SoftwarePlatform | "")}><option value="">Todos</option>{platforms.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
      </section>

      <p className="library-result" role="status">{filtered.length} {filtered.length === 1 ? "aplicativo encontrado" : "aplicativos encontrados"}</p>
      {filtered.length ? <div className="app-shelf">{filtered.map((app) => <AppCard app={app} key={app.slug} />)}</div> : <div className="library-empty" role="status"><h2>Nenhum aplicativo nesse recorte.</h2><p>Tente outro termo ou retire um dos filtros.</p><button className="button button-quiet" type="button" onClick={() => { setQuery(""); setCategory(""); setPlatform(""); }}>Limpar filtros</button></div>}
    </div>
  );
}

function AppCard({ app }: { app: OpenSourceApp }) {
  const download = app.downloadSources[0];
  return (
    <article className="app-card">
      <div className="app-card__top"><div><p className="app-card__kicker">{app.categories.map((category) => appCategories.find((item) => item.id === category)?.name).join(" · ")}</p><h2><Link href={`/library/${app.slug}`}>{app.name}</Link></h2></div><span className="app-card__license" title={app.license.name}>{app.license.spdx}</span></div>
      <p>{app.description}</p>
      <ul className="feature-tags" aria-label={`Recursos de ${app.name}`}>{app.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
      <footer className="app-card__footer"><span>{app.platforms.map((item) => platforms.find((platform) => platform.id === item)?.label).join(" · ")}</span><a href={download.url} target="_blank" rel="noreferrer">Download oficial <ExternalLink size={14} /></a></footer>
    </article>
  );
}
