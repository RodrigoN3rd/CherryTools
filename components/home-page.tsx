import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, tools } from "@/lib/tools/catalog";
import { GoogleSymbol } from "./google-symbol";
import { ToolCard } from "./tool-card";

export function HomePage() {
  return (
    <div className="page">
      <header className="page-header">
        <span className="desktop-only eyebrow">Estúdio criativo em seu navegador</span>
        <Link className="desktop-only button button-quiet button-small" href="/premium">Sem anúncios por R$ 9,99</Link>
      </header>
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Pequenas ferramentas, ideias inteiras</p>
          <h1 id="home-title" className="display-title">Um lugar calmo<br />para deixar sua<br /><em>criação florescer.</em></h1>
          <p className="intro">Trinta e cinco estúdios práticos para cor, imagem, tipo, web e direção criativa. Seus arquivos ficam no seu dispositivo.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#colors">Escolher uma ferramenta <ArrowRight size={16} /></a>
            <Link className="button button-quiet" href="/tools/color-palette-generator">Gerar uma paleta</Link>
          </div>
        </div>
        <div className="hero-art" aria-label="Uma amostra de paleta criativa" role="img">
          <div className="cherry-paper">
            <span className="cherry-paper__label"><GoogleSymbol name="brush" size={14} /> caderno de cor</span>
            <h2>Um pequeno gesto, uma grande direção.</h2>
            <div className="paper-swatches" aria-hidden="true"><span style={{ background: "#B83B4B" }} /><span style={{ background: "#E9A3AD" }} /><span style={{ background: "#F6DDE2" }} /><span style={{ background: "#622E3B" }} /></div>
          </div>
        </div>
      </section>
      {categories.map((category) => {
        const categoryTools = tools.filter((tool) => tool.category === category.id);
        return (
          <section className="section" id={category.id} key={category.id} aria-labelledby={`${category.id}-title`}>
            <div className="section-heading">
              <div><p className="eyebrow">{category.description}</p><h2 id={`${category.id}-title`}>{category.name}</h2></div>
              <p>{categoryTools.length} ferramentas pensadas para sair do rascunho sem sair do seu fluxo.</p>
            </div>
            <div className="tool-shelf">{categoryTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div>
          </section>
        );
      })}
    </div>
  );
}
