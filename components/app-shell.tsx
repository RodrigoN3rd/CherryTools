import Link from "next/link";
import { Compass, Crown, Home, Search } from "lucide-react";
import { categories } from "@/lib/tools/catalog";
import { BrandMark } from "./brand-mark";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <aside className="desktop-rail" aria-label="Navegação principal">
        <div className="rail-inner">
          <Link href="/" aria-label="Página inicial"><BrandMark /></Link>
          <p className="rail-note">Ateliês</p>
          <nav className="category-nav" aria-label="Categorias">
            {categories.map((category) => (
              <Link className="category-link" href={`/#${category.id}`} key={category.id}>
                <span>{category.name}</span><span>ver</span>
              </Link>
            ))}
          </nav>
          <p className="rail-note">Descobrir</p>
          <nav className="category-nav" aria-label="Biblioteca">
            <Link className="category-link" href="/library"><span>Apps livres</span><span>ver</span></Link>
          </nav>
          <div className="desktop-rail__footer rail-upgrade">
            <p>Mais espaço<br />para criar.</p>
            <Link className="button button-small button-primary" href="/premium">Conhecer Premium</Link>
          </div>
        </div>
      </aside>
      <main id="main-content" className="shell-main">{children}</main>
      <nav className="mobile-bar" aria-label="Navegação de bolso">
        <Link className="mobile-nav-link" href="/"><Home /><span>Início</span></Link>
        <Link className="mobile-nav-link" href="/#colors"><Search /><span>Explorar</span></Link>
        <Link className="mobile-nav-link" href="/library"><Compass /><span>Biblioteca</span></Link>
        <Link className="mobile-nav-link" href="/premium"><Crown /><span>Premium</span></Link>
      </nav>
    </div>
  );
}
