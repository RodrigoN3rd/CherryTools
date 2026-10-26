export type ToolCategory = "colors" | "images" | "type" | "web" | "creative";
export type ToolKind =
  | "palette"
  | "extractor"
  | "gradient"
  | "contrast"
  | "harmony"
  | "resize"
  | "compress"
  | "convert"
  | "crop"
  | "pixel"
  | "font-pairing"
  | "type-scale"
  | "text-shadow"
  | "google-font-explorer"
  | "variable-font-axis"
  | "typographic-poster"
  | "text-outline"
  | "monogram"
  | "text-path"
  | "quote-card"
  | "kinetic-type"
  | "box-shadow"
  | "radius"
  | "svg"
  | "pattern"
  | "layout-grid"
  | "button-studio"
  | "glass-surface"
  | "mesh-gradient"
  | "hero-composer"
  | "device-mockup"
  | "organic-background"
  | "moodboard"
  | "prompt"
  | "social";

export type ToolDefinition = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  category: ToolCategory;
  kind: ToolKind;
  icon: string;
  keywords: string[];
};

export const categories: Array<{ id: ToolCategory; name: string; description: string; color: string }> = [
  { id: "colors", name: "Cores", description: "Decisões cromáticas sem adivinhação.", color: "#B83B4B" },
  { id: "images", name: "Imagens", description: "Ajustes locais, sem enviar seus arquivos.", color: "#D77988" },
  { id: "type", name: "Tipografia", description: "Ritmo, pares e presença editorial.", color: "#8B5963" },
  { id: "web", name: "Web design", description: "CSS útil, visual e copiável.", color: "#9D6A54" },
  { id: "creative", name: "Criatividade", description: "Um ateliê para começar com intenção.", color: "#6B7563" }
];

export const tools: ToolDefinition[] = [
  { slug: "color-palette-generator", name: "Paletas", eyebrow: "Cor em conjunto", description: "Monte paletas equilibradas, bloqueie favoritas e leve os códigos consigo.", category: "colors", kind: "palette", icon: "Palette", keywords: ["paleta", "hex", "css"] },
  { slug: "image-color-extractor", name: "Extrair cores", eyebrow: "Cor da imagem", description: "Encontre as cores dominantes de uma imagem direto no navegador.", category: "colors", kind: "extractor", icon: "Eyedropper", keywords: ["imagem", "cores", "dominantes"] },
  { slug: "gradient-generator", name: "Gradientes", eyebrow: "Transições suaves", description: "Crie gradientes lineares e radiais prontos para CSS.", category: "colors", kind: "gradient", icon: "Blend", keywords: ["gradient", "css", "linear"] },
  { slug: "color-contrast-checker", name: "Contraste", eyebrow: "Leitura acessível", description: "Confira AA e AAA e receba uma cor alternativa utilizável.", category: "colors", kind: "contrast", icon: "Contrast", keywords: ["wcag", "acessibilidade", "aa"] },
  { slug: "color-harmony-explorer", name: "Harmonias", eyebrow: "Roda cromática", description: "Explore relações complementares, análogas e triádicas.", category: "colors", kind: "harmony", icon: "CircleDot", keywords: ["harmonia", "roda", "cor"] },
  { slug: "image-resizer", name: "Redimensionar", eyebrow: "Imagem no tamanho certo", description: "Altere medidas em lote preservando proporção e privacidade.", category: "images", kind: "resize", icon: "Maximize", keywords: ["resize", "largura", "lote"] },
  { slug: "image-compressor", name: "Comprimir", eyebrow: "Arquivos mais leves", description: "Compare qualidade e tamanho antes de baixar sua nova imagem.", category: "images", kind: "compress", icon: "FileDown", keywords: ["compress", "webp", "qualidade"] },
  { slug: "image-format-converter", name: "Converter formato", eyebrow: "Pronto para publicar", description: "Converta PNG, JPG, WEBP e AVIF se seu navegador suportar.", category: "images", kind: "convert", icon: "Repeat2", keywords: ["png", "jpg", "webp"] },
  { slug: "image-cropper", name: "Recortar", eyebrow: "Enquadramento preciso", description: "Recorte, gire e escolha proporções para cada uso.", category: "images", kind: "crop", icon: "Crop", keywords: ["crop", "instagram", "rotação"] },
  { slug: "pixel-art-converter", name: "Pixel art", eyebrow: "Pixels com intenção", description: "Reduza resolução e cores para um resultado pixelado limpo.", category: "images", kind: "pixel", icon: "Grid2X2", keywords: ["pixel", "8bit", "png"] },
  { slug: "font-pairing-studio", name: "Pares de fontes", eyebrow: "Voz tipográfica", description: "Veja títulos e textos juntos antes de adotar uma combinação.", category: "type", kind: "font-pairing", icon: "Type", keywords: ["fontes", "heading", "body"] },
  { slug: "typography-scale-generator", name: "Escala tipográfica", eyebrow: "Ritmo mensurável", description: "Gere uma escala modular consistente e copie o CSS.", category: "type", kind: "type-scale", icon: "ListTree", keywords: ["escala", "rem", "css"] },
  { slug: "text-shadow-generator", name: "Sombra de texto", eyebrow: "Profundidade delicada", description: "Ajuste uma sombra tipográfica e exporte a declaração CSS.", category: "type", kind: "text-shadow", icon: "TextCursorInput", keywords: ["text shadow", "css", "tipografia"] },
  { slug: "google-font-explorer", name: "Google Fonts", eyebrow: "Famílias em contexto", description: "Experimente famílias do Google Fonts e baixe a composição em PNG.", category: "type", kind: "google-font-explorer", icon: "Type", keywords: ["google fonts", "família", "png"] },
  { slug: "variable-font-axis-studio", name: "Eixos variáveis", eyebrow: "Peso e largura", description: "Encontre a expressão certa em uma fonte variável e exporte o estudo.", category: "type", kind: "variable-font-axis", icon: "TextCursorInput", keywords: ["variable font", "wght", "wdth"] },
  { slug: "typographic-poster", name: "Pôster tipográfico", eyebrow: "Palavras em cena", description: "Componha um pôster editorial com tipografia, cor e ritmo.", category: "type", kind: "typographic-poster", icon: "PanelsTopLeft", keywords: ["poster", "tipografia", "png"] },
  { slug: "text-outline-studio", name: "Contorno de texto", eyebrow: "Preenchimento e linha", description: "Ajuste contorno, preenchimento e presença para uma frase marcante.", category: "type", kind: "text-outline", icon: "TextCursorInput", keywords: ["outline", "stroke", "texto"] },
  { slug: "monogram-generator", name: "Monograma", eyebrow: "Assinatura compacta", description: "Crie iniciais com forma, cor e proporção prontas para baixar.", category: "type", kind: "monogram", icon: "Type", keywords: ["monograma", "iniciais", "marca"] },
  { slug: "text-on-a-path", name: "Texto em curva", eyebrow: "Ritmo circular", description: "Distribua palavras por um arco e exporte a composição em PNG.", category: "type", kind: "text-path", icon: "Spline", keywords: ["texto em curva", "arco", "png"] },
  { slug: "quote-card-generator", name: "Cartão de citação", eyebrow: "Uma frase fica", description: "Transforme uma citação em uma peça compartilhável no seu navegador.", category: "type", kind: "quote-card", icon: "Frames", keywords: ["quote", "citação", "card"] },
  { slug: "kinetic-typography-loop", name: "Tipografia cinética", eyebrow: "Movimento de letras", description: "Anime uma frase em loop e baixe PNG ou vídeo WebM.", category: "type", kind: "kinetic-type", icon: "Sparkles", keywords: ["kinetic type", "webm", "animação"] },
  { slug: "css-box-shadow-generator", name: "Sombras CSS", eyebrow: "Elevação sem peso", description: "Empilhe camadas de sombra e copie um CSS claro.", category: "web", kind: "box-shadow", icon: "Layers", keywords: ["box shadow", "css", "inset"] },
  { slug: "border-radius-generator", name: "Bordas orgânicas", eyebrow: "Forma e toque", description: "Controle cada canto ou experimente uma forma assimétrica.", category: "web", kind: "radius", icon: "Squircle", keywords: ["border radius", "css", "blob"] },
  { slug: "svg-shape-generator", name: "Formas SVG", eyebrow: "Silhuetas próprias", description: "Gere ondas, blobs, círculos e polígonos editáveis.", category: "web", kind: "svg", icon: "Shapes", keywords: ["svg", "wave", "blob"] },
  { slug: "css-pattern-generator", name: "Padrões CSS", eyebrow: "Textura que não pesa", description: "Crie pontos, linhas, grades e xadrez em CSS puro.", category: "web", kind: "pattern", icon: "LayoutTemplate", keywords: ["pattern", "background", "css"] },
  { slug: "layout-grid-generator", name: "Grid de layout", eyebrow: "Estrutura visível", description: "Construa colunas, margens e respiros para uma página mais clara.", category: "web", kind: "layout-grid", icon: "Grid2X2", keywords: ["grid", "layout", "colunas"] },
  { slug: "button-studio", name: "Estúdio de botões", eyebrow: "Ação com caráter", description: "Desenhe botões de interface e exporte uma prancha em PNG.", category: "web", kind: "button-studio", icon: "Frames", keywords: ["button", "ui", "botão"] },
  { slug: "glass-surface-generator", name: "Superfície de vidro", eyebrow: "Transparência tátil", description: "Combine transparência, desfoque e brilho em uma superfície de vidro.", category: "web", kind: "glass-surface", icon: "Layers", keywords: ["glassmorphism", "blur", "surface"] },
  { slug: "mesh-gradient-generator", name: "Gradiente mesh", eyebrow: "Cor com profundidade", description: "Misture pontos de cor e baixe um fundo suave em PNG.", category: "web", kind: "mesh-gradient", icon: "Blend", keywords: ["mesh gradient", "fundo", "png"] },
  { slug: "hero-composer", name: "Compositor de hero", eyebrow: "Primeira impressão", description: "Estruture uma hero section com mensagem, ação e direção visual.", category: "web", kind: "hero-composer", icon: "LayoutTemplate", keywords: ["hero", "landing page", "layout"] },
  { slug: "device-mockup-generator", name: "Mockup de dispositivo", eyebrow: "Interface em cena", description: "Enquadre uma interface em dispositivo e exporte a imagem final.", category: "web", kind: "device-mockup", icon: "Frame", keywords: ["mockup", "device", "phone"] },
  { slug: "organic-background-loop", name: "Fundo orgânico", eyebrow: "Cor em movimento", description: "Gere um fundo fluido e baixe PNG ou vídeo WebM local.", category: "web", kind: "organic-background", icon: "Sparkles", keywords: ["background", "webm", "animação"] },
  { slug: "moodboard-creator", name: "Moodboard", eyebrow: "Referências em conversa", description: "Organize imagens, notas e cores numa única prancha exportável.", category: "creative", kind: "moodboard", icon: "PanelsTopLeft", keywords: ["moodboard", "referência", "png"] },
  { slug: "design-inspiration-prompt-generator", name: "Ideias de projeto", eyebrow: "Começos melhores", description: "Monte um briefing acionável sem depender de IA paga.", category: "creative", kind: "prompt", icon: "Sparkles", keywords: ["briefing", "ideias", "prompt"] },
  { slug: "social-media-canvas-studio", name: "Canvas social", eyebrow: "Publicar com cuidado", description: "Componha uma arte social simples e exporte em PNG.", category: "creative", kind: "social", icon: "Frames", keywords: ["social", "instagram", "canvas"] }
];

export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug);
