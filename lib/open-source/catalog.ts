export type AppCategory =
  | "image-editing"
  | "illustration"
  | "3d"
  | "animation"
  | "video"
  | "audio"
  | "vector"
  | "photography"
  | "pixel-art"
  | "game-development"
  | "typography"
  | "creative-productivity"
  | "programming"
  | "screen-capture"
  | "interface-design";

export type SoftwarePlatform = "windows" | "macos" | "linux" | "android" | "web";

export type SoftwareLicense = {
  spdx: string;
  name: string;
};

export type DownloadSource = {
  label: string;
  url: string;
  platforms: SoftwarePlatform[];
  isOfficial: true;
};

export type SoftwareRelease = {
  verifiedAt: string;
  updateSource: "official-download-page" | "official-release-page";
};

export type OpenSourceApp = {
  slug: string;
  name: string;
  description: string;
  categories: AppCategory[];
  features: string[];
  platforms: SoftwarePlatform[];
  license: SoftwareLicense;
  officialSite: string;
  repository: string;
  documentation?: string;
  downloadSources: DownloadSource[];
  verification: SoftwareRelease & { status: "verified" };
  relatedToolSlugs: string[];
};

export const appCategories: Array<{ id: AppCategory; name: string }> = [
  { id: "image-editing", name: "Edição de imagem" },
  { id: "illustration", name: "Desenho e ilustração" },
  { id: "3d", name: "Modelagem 3D" },
  { id: "animation", name: "Animação" },
  { id: "video", name: "Edição de vídeo" },
  { id: "audio", name: "Áudio e música" },
  { id: "vector", name: "Design vetorial" },
  { id: "photography", name: "Fotografia" },
  { id: "pixel-art", name: "Pixel art" },
  { id: "game-development", name: "Desenvolvimento de jogos" },
  { id: "typography", name: "Tipografia" },
  { id: "creative-productivity", name: "Produtividade criativa" },
  { id: "programming", name: "Ferramentas de programação" },
  { id: "screen-capture", name: "Captura de tela e gravação" },
  { id: "interface-design", name: "Design de interfaces" }
];

const verifiedAt = "2026-10-27";
const source = (url: string, platforms: SoftwarePlatform[], label = "Downloads oficiais"): DownloadSource => ({ label, url, platforms, isOfficial: true });
const app = (entry: Omit<OpenSourceApp, "verification">): OpenSourceApp => ({
  ...entry,
  verification: { status: "verified", verifiedAt, updateSource: "official-download-page" }
});

export const openSourceApps: OpenSourceApp[] = [
  app({ slug: "gimp", name: "GIMP", description: "Editor de imagem para composição, retoque e criação de arte raster.", categories: ["image-editing"], features: ["camadas", "máscaras", "pincéis"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://www.gimp.org/", repository: "https://gitlab.gnome.org/GNOME/gimp", documentation: "https://docs.gimp.org/", downloadSources: [source("https://www.gimp.org/downloads/", ["windows", "macos", "linux"])], relatedToolSlugs: ["image-color-extractor", "image-cropper", "color-palette-generator"] }),
  app({ slug: "krita", name: "Krita", description: "Pintura digital e ilustração com pincéis expressivos e recursos de quadrinhos.", categories: ["illustration", "image-editing"], features: ["pincéis", "estabilizador", "assistentes"], platforms: ["windows", "macos", "linux", "android"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://krita.org/", repository: "https://invent.kde.org/graphics/krita", documentation: "https://docs.krita.org/", downloadSources: [source("https://krita.org/en/download/", ["windows", "macos", "linux", "android"])], relatedToolSlugs: ["moodboard-creator", "color-palette-generator", "brand-kit-creator"] }),
  app({ slug: "blender", name: "Blender", description: "Suite integrada para modelagem 3D, animação, composição e renderização.", categories: ["3d", "animation"], features: ["modelagem", "renderização", "animação"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://www.blender.org/", repository: "https://projects.blender.org/blender/blender", documentation: "https://docs.blender.org/", downloadSources: [source("https://www.blender.org/download/", ["windows", "macos", "linux"])], relatedToolSlugs: ["color-harmony-explorer", "moodboard-creator", "mesh-gradient-generator"] }),
  app({ slug: "inkscape", name: "Inkscape", description: "Editor vetorial para ilustração, logotipos e diagramas em SVG.", categories: ["vector", "illustration"], features: ["SVG", "nós", "tipografia"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-2.0-or-later", name: "GNU GPL v2 ou posterior" }, officialSite: "https://inkscape.org/", repository: "https://gitlab.com/inkscape/inkscape", documentation: "https://inkscape-manuals.readthedocs.io/", downloadSources: [source("https://inkscape.org/release/", ["windows", "macos", "linux"])], relatedToolSlugs: ["svg-shape-generator", "monogram-generator", "color-palette-generator"] }),
  app({ slug: "kdenlive", name: "Kdenlive", description: "Editor de vídeo multipista com composição e fluxos de pós-produção.", categories: ["video"], features: ["timeline", "transições", "proxy"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://kdenlive.org/", repository: "https://invent.kde.org/multimedia/kdenlive", documentation: "https://docs.kdenlive.org/", downloadSources: [source("https://kdenlive.org/download/", ["windows", "macos", "linux"])], relatedToolSlugs: ["thumbnail-studio", "story-designer", "social-safe-zone-checker"] }),
  app({ slug: "shotcut", name: "Shotcut", description: "Editor de vídeo de código aberto com filtros e uma timeline multiformato.", categories: ["video"], features: ["filtros", "timeline", "formatos"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://www.shotcut.org/", repository: "https://github.com/mltframework/shotcut", documentation: "https://shotcut.org/howtos/", downloadSources: [source("https://www.shotcut.org/download/", ["windows", "macos", "linux"])], relatedToolSlugs: ["thumbnail-studio", "social-safe-zone-checker"] }),
  app({ slug: "obs-studio", name: "OBS Studio", description: "Gravação de tela e transmissão com cenas, fontes e mixagem de áudio.", categories: ["screen-capture", "video"], features: ["cenas", "streaming", "gravação de tela"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-2.0-only", name: "GNU GPL v2" }, officialSite: "https://obsproject.com/", repository: "https://github.com/obsproject/obs-studio", documentation: "https://obsproject.com/kb/", downloadSources: [source("https://obsproject.com/download", ["windows", "macos", "linux"])], relatedToolSlugs: ["thumbnail-studio", "content-checklist-generator"] }),
  app({ slug: "audacity", name: "Audacity", description: "Editor e gravador de áudio para faixas, cortes e tratamento sonoro.", categories: ["audio"], features: ["multifaixa", "efeitos", "gravação"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://www.audacityteam.org/", repository: "https://github.com/audacity/audacity", documentation: "https://support.audacityteam.org/", downloadSources: [source("https://www.audacityteam.org/download/", ["windows", "macos", "linux"])], relatedToolSlugs: ["content-checklist-generator", "media-kit-builder"] }),
  app({ slug: "ardour", name: "Ardour", description: "Estação de trabalho de áudio digital para gravação e mixagem profissional.", categories: ["audio"], features: ["DAW", "mixagem", "automação"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-2.0-or-later", name: "GNU GPL v2 ou posterior" }, officialSite: "https://ardour.org/", repository: "https://github.com/Ardour/ardour", documentation: "https://manual.ardour.org/", downloadSources: [source("https://ardour.org/download.html", ["windows", "macos", "linux"])], relatedToolSlugs: ["content-checklist-generator"] }),
  app({ slug: "godot", name: "Godot", description: "Motor de jogos 2D e 3D com editor visual, scripts e exportação multiplataforma.", categories: ["game-development"], features: ["2D", "3D", "GDScript"], platforms: ["windows", "macos", "linux", "android"], license: { spdx: "MIT", name: "MIT License" }, officialSite: "https://godotengine.org/", repository: "https://github.com/godotengine/godot", documentation: "https://docs.godotengine.org/", downloadSources: [source("https://godotengine.org/download/", ["windows", "macos", "linux", "android"])], relatedToolSlugs: ["pixel-art-converter", "svg-shape-generator", "color-palette-generator"] }),
  app({ slug: "penpot", name: "Penpot", description: "Ferramenta colaborativa de design de interfaces baseada na web e em padrões abertos.", categories: ["interface-design"], features: ["prototipagem", "componentes", "colaboração"], platforms: ["web"], license: { spdx: "MPL-2.0", name: "Mozilla Public License 2.0" }, officialSite: "https://penpot.app/", repository: "https://github.com/penpot/penpot", documentation: "https://help.penpot.app/", downloadSources: [source("https://penpot.app/self-host", ["web"], "Auto-hospedagem oficial")], relatedToolSlugs: ["layout-grid-generator", "button-studio", "hero-composer"] }),
  app({ slug: "freecad", name: "FreeCAD", description: "Modelagem paramétrica para projetos mecânicos e objetos em 3D.", categories: ["3d"], features: ["CAD", "paramétrico", "desenho técnico"], platforms: ["windows", "macos", "linux"], license: { spdx: "LGPL-2.1-or-later", name: "GNU LGPL v2.1 ou posterior" }, officialSite: "https://www.freecad.org/", repository: "https://github.com/FreeCAD/FreeCAD", documentation: "https://wiki.freecad.org/", downloadSources: [source("https://www.freecad.org/downloads.php", ["windows", "macos", "linux"])], relatedToolSlugs: ["device-mockup-generator", "svg-shape-generator"] }),
  app({ slug: "scribus", name: "Scribus", description: "Diagramação para publicações, documentos e saída profissional em PDF.", categories: ["creative-productivity", "typography"], features: ["layout", "PDF", "pré-impressão"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-2.0-or-later", name: "GNU GPL v2 ou posterior" }, officialSite: "https://www.scribus.net/", repository: "https://gitlab.com/scribus/scribus", documentation: "https://wiki.scribus.net/", downloadSources: [source("https://www.scribus.net/downloads/", ["windows", "macos", "linux"])], relatedToolSlugs: ["typographic-poster", "media-kit-builder", "quote-card-generator"] }),
  app({ slug: "darktable", name: "darktable", description: "Fluxo fotográfico não destrutivo para organização e revelação de imagens RAW.", categories: ["photography", "image-editing"], features: ["RAW", "catálogo", "correções"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://www.darktable.org/", repository: "https://github.com/darktable-org/darktable", documentation: "https://docs.darktable.org/", downloadSources: [source("https://www.darktable.org/install/", ["windows", "macos", "linux"])], relatedToolSlugs: ["image-color-extractor", "color-harmony-explorer"] }),
  app({ slug: "rawtherapee", name: "RawTherapee", description: "Revelação de fotos RAW com controles avançados de cor e detalhe.", categories: ["photography"], features: ["RAW", "exposição", "detalhe"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://www.rawtherapee.com/", repository: "https://github.com/RawTherapee/RawTherapee", documentation: "https://rawpedia.rawtherapee.com/", downloadSources: [source("https://www.rawtherapee.com/downloads/", ["windows", "macos", "linux"])], relatedToolSlugs: ["image-color-extractor", "image-compressor"] }),
  app({ slug: "pinta", name: "Pinta", description: "Editor raster simples para desenhos, ajustes e anotações de imagens.", categories: ["image-editing", "illustration"], features: ["camadas", "efeitos", "desenho"], platforms: ["windows", "macos", "linux"], license: { spdx: "MIT", name: "MIT License" }, officialSite: "https://www.pinta-project.com/", repository: "https://github.com/PintaProject/Pinta", documentation: "https://www.pinta-project.com/howto/", downloadSources: [source("https://www.pinta-project.com/releases/", ["windows", "macos", "linux"])], relatedToolSlugs: ["image-cropper", "meme-quote-maker"] }),
  app({ slug: "mypaint", name: "MyPaint", description: "Aplicativo focado em pintura livre com uma tela sem distrações e pincéis configuráveis.", categories: ["illustration"], features: ["pincéis", "tela infinita", "pressão"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-2.0-or-later", name: "GNU GPL v2 ou posterior" }, officialSite: "https://mypaint.app/", repository: "https://github.com/mypaint/mypaint", documentation: "https://github.com/mypaint/mypaint/wiki", downloadSources: [source("https://www.mypaint.app/", ["windows", "macos", "linux"])], relatedToolSlugs: ["moodboard-creator", "color-palette-generator"] }),
  app({ slug: "synfig", name: "Synfig Studio", description: "Animação 2D com interpolação entre poses e composição vetorial.", categories: ["animation"], features: ["rigging", "tweening", "vetor"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://www.synfig.org/", repository: "https://github.com/synfig/synfig", documentation: "https://wiki.synfig.org/", downloadSources: [source("https://www.synfig.org/", ["windows", "macos", "linux"])], relatedToolSlugs: ["kinetic-typography-loop", "organic-background-loop"] }),
  app({ slug: "opentoonz", name: "OpenToonz", description: "Animação 2D para desenho, composição e produção de cenas.", categories: ["animation"], features: ["animação 2D", "cenas", "efeitos"], platforms: ["windows", "macos", "linux"], license: { spdx: "BSD-3-Clause", name: "BSD 3-Clause" }, officialSite: "https://opentoonz.github.io/e/", repository: "https://github.com/opentoonz/opentoonz", documentation: "https://opentoonz.github.io/e/", downloadSources: [source("https://opentoonz.github.io/e/", ["windows", "macos", "linux"])], relatedToolSlugs: ["story-designer", "kinetic-typography-loop"] }),
  app({ slug: "natron", name: "Natron", description: "Composição nodal para efeitos visuais e pós-produção de vídeo.", categories: ["video", "animation"], features: ["nodes", "composição", "VFX"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-2.0-or-later", name: "GNU GPL v2 ou posterior" }, officialSite: "https://natrongithub.github.io/", repository: "https://github.com/NatronGitHub/Natron", documentation: "https://natron.readthedocs.io/", downloadSources: [source("https://natrongithub.github.io/", ["windows", "macos", "linux"])], relatedToolSlugs: ["organic-background-loop", "mesh-gradient-generator"] }),
  app({ slug: "pixelorama", name: "Pixelorama", description: "Editor de pixel art com animação por quadros e ferramentas de sprites.", categories: ["pixel-art", "animation"], features: ["sprites", "frames", "paletas"], platforms: ["windows", "macos", "linux", "web"], license: { spdx: "MIT", name: "MIT License" }, officialSite: "https://orama-interactive.itch.io/pixelorama", repository: "https://github.com/Orama-Interactive/Pixelorama", documentation: "https://www.oramainteractive.com/Pixelorama-Docs/", downloadSources: [source("https://orama-interactive.itch.io/pixelorama", ["windows", "macos", "linux", "web"])], relatedToolSlugs: ["pixel-art-converter", "color-palette-generator"] }),
  app({ slug: "libresprite", name: "LibreSprite", description: "Editor de sprites e animação baseado em uma base de código livre para pixel art.", categories: ["pixel-art", "animation"], features: ["sprites", "animação", "tiles"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-2.0-only", name: "GNU GPL v2" }, officialSite: "https://libresprite.github.io/", repository: "https://github.com/LibreSprite/LibreSprite", documentation: "https://github.com/LibreSprite/LibreSprite/wiki", downloadSources: [source("https://libresprite.github.io/#!/downloads", ["windows", "macos", "linux"])], relatedToolSlugs: ["pixel-art-converter", "color-palette-generator"] }),
  app({ slug: "tiled", name: "Tiled", description: "Editor de mapas em tiles para jogos 2D e mundos baseados em grade.", categories: ["game-development", "pixel-art"], features: ["tilemaps", "camadas", "exportação"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-2.0-only", name: "GNU GPL v2" }, officialSite: "https://www.mapeditor.org/", repository: "https://github.com/mapeditor/tiled", documentation: "https://doc.mapeditor.org/", downloadSources: [source("https://www.mapeditor.org/download.html", ["windows", "macos", "linux"])], relatedToolSlugs: ["pixel-art-converter", "svg-shape-generator"] }),
  app({ slug: "lmms", name: "LMMS", description: "Criação musical com sequenciador, instrumentos e automação.", categories: ["audio"], features: ["sequenciador", "MIDI", "instrumentos"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-2.0-or-later", name: "GNU GPL v2 ou posterior" }, officialSite: "https://lmms.io/", repository: "https://github.com/LMMS/lmms", documentation: "https://docs.lmms.io/", downloadSources: [source("https://lmms.io/download", ["windows", "macos", "linux"])], relatedToolSlugs: ["content-checklist-generator"] }),
  app({ slug: "musescore", name: "MuseScore Studio", description: "Composição e edição de partituras com reprodução e exportação musical.", categories: ["audio", "creative-productivity"], features: ["partituras", "MIDI", "exportação"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://musescore.org/", repository: "https://github.com/musescore/MuseScore", documentation: "https://handbook.musescore.org/", downloadSources: [source("https://musescore.org/en/download", ["windows", "macos", "linux"])], relatedToolSlugs: ["content-checklist-generator"] }),
  app({ slug: "sonic-pi", name: "Sonic Pi", description: "Ambiente de programação musical para criar sons e performances ao vivo.", categories: ["audio", "programming"], features: ["live coding", "sintetizadores", "MIDI"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://sonic-pi.net/", repository: "https://github.com/sonic-pi-net/sonic-pi", documentation: "https://sonic-pi.net/tutorial.html", downloadSources: [source("https://sonic-pi.net/", ["windows", "macos", "linux"])], relatedToolSlugs: ["content-checklist-generator"] }),
  app({ slug: "openshot", name: "OpenShot", description: "Editor de vídeo acessível com timeline, títulos e animações básicas.", categories: ["video"], features: ["timeline", "títulos", "animação"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://www.openshot.org/", repository: "https://github.com/OpenShot/openshot-qt", documentation: "https://www.openshot.org/user-guide/", downloadSources: [source("https://www.openshot.org/download/", ["windows", "macos", "linux"])], relatedToolSlugs: ["thumbnail-studio", "post-mockup-generator"] }),
  app({ slug: "handbrake", name: "HandBrake", description: "Transcodificador de vídeo para converter formatos e preparar arquivos de publicação.", categories: ["video"], features: ["conversão", "presets", "fila"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-2.0-only", name: "GNU GPL v2" }, officialSite: "https://handbrake.fr/", repository: "https://github.com/HandBrake/HandBrake", documentation: "https://handbrake.fr/docs/", downloadSources: [source("https://handbrake.fr/downloads.php", ["windows", "macos", "linux"])], relatedToolSlugs: ["social-safe-zone-checker", "content-checklist-generator"] }),
  app({ slug: "flameshot", name: "Flameshot", description: "Captura de tela com anotações, atalhos e exportação rápida.", categories: ["screen-capture"], features: ["captura", "anotações", "atalhos"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://flameshot.org/", repository: "https://github.com/flameshot-org/flameshot", documentation: "https://flameshot.org/docs/", downloadSources: [source("https://flameshot.org/#download", ["windows", "macos", "linux"])], relatedToolSlugs: ["post-mockup-generator", "media-kit-builder"] }),
  app({ slug: "sharex", name: "ShareX", description: "Captura, gravação e compartilhamento configurável para Windows.", categories: ["screen-capture"], features: ["captura", "gravação", "workflows"], platforms: ["windows"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://getsharex.com/", repository: "https://github.com/ShareX/ShareX", documentation: "https://getsharex.com/docs/", downloadSources: [source("https://getsharex.com/downloads", ["windows"])], relatedToolSlugs: ["post-mockup-generator", "content-checklist-generator"] }),
  app({ slug: "kooha", name: "Kooha", description: "Gravador de tela simples para ambientes Linux.", categories: ["screen-capture"], features: ["gravação", "área de tela", "Wayland"], platforms: ["linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://apps.gnome.org/Kooha/", repository: "https://github.com/SeaDve/Kooha", documentation: "https://github.com/SeaDve/Kooha", downloadSources: [source("https://flathub.org/apps/io.github.seadve.Kooha", ["linux"], "Flatpak oficial")], relatedToolSlugs: ["content-checklist-generator"] }),
  app({ slug: "fontforge", name: "FontForge", description: "Editor de fontes para criar, inspecionar e converter famílias tipográficas.", categories: ["typography"], features: ["glifos", "kerning", "OpenType"], platforms: ["windows", "macos", "linux"], license: { spdx: "BSD-3-Clause", name: "BSD 3-Clause" }, officialSite: "https://fontforge.org/", repository: "https://github.com/fontforge/fontforge", documentation: "https://fontforge.org/docs/", downloadSources: [source("https://fontforge.org/en-US/downloads/", ["windows", "macos", "linux"])], relatedToolSlugs: ["google-font-explorer", "variable-font-axis-studio"] }),
  app({ slug: "sigil", name: "Sigil", description: "Editor de ebooks EPUB para produção, revisão e validação de livros digitais.", categories: ["creative-productivity", "typography"], features: ["EPUB", "HTML", "validação"], platforms: ["windows", "macos", "linux"], license: { spdx: "GPL-3.0-or-later", name: "GNU GPL v3 ou posterior" }, officialSite: "https://sigil-ebook.com/", repository: "https://github.com/Sigil-Ebook/Sigil", documentation: "https://sigil-ebook.com/documentation/", downloadSources: [source("https://sigil-ebook.com/sigil/download/", ["windows", "macos", "linux"])], relatedToolSlugs: ["typography-scale-generator", "text-on-a-path"] })
];

export const getOpenSourceApp = (slug: string) => openSourceApps.find((app) => app.slug === slug);

const normalized = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export function searchOpenSourceApps(query: string): OpenSourceApp[] {
  const terms = normalized(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return openSourceApps;
  return openSourceApps.filter((entry) => {
    const haystack = normalized([entry.name, entry.description, ...entry.features, ...entry.categories].join(" "));
    return terms.every((term) => haystack.includes(term));
  });
}
