export type RgbColor = { r: number; g: number; b: number };
export type HslColor = { h: number; s: number; l: number };
export type HarmonyMode = "random" | "complementary" | "analogous" | "triadic";

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const normaliseHue = (hue: number) => ((hue % 360) + 360) % 360;

export function normaliseHex(value: string): string {
  const clean = value.trim().replace(/^#/, "");
  const full = clean.length === 3 ? clean.split("").map((item) => item + item).join("") : clean;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error("Use uma cor HEX válida, por exemplo #B83B4B.");
  }

  return `#${full.toUpperCase()}`;
}

export function hexToRgb(value: string): RgbColor {
  const hex = normaliseHex(value).slice(1);
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16)
  };
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  const channel = (value: number) => Math.round(clamp(value, 0, 255)).toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let h = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    if (max === red) h = 60 * (((green - blue) / delta) % 6);
    if (max === green) h = 60 * ((blue - red) / delta + 2);
    if (max === blue) h = 60 * ((red - green) / delta + 4);
  }

  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h: Math.round(normaliseHue(h)), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex(hue: number, saturation: number, lightness: number): string {
  const h = normaliseHue(hue) / 360;
  const s = clamp(saturation) / 100;
  const l = clamp(lightness) / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((h * 6) % 2) - 1));
  const match = l - chroma / 2;
  let [r, g, b] = [0, 0, 0];

  if (h < 1 / 6) [r, g, b] = [chroma, x, 0];
  else if (h < 2 / 6) [r, g, b] = [x, chroma, 0];
  else if (h < 3 / 6) [r, g, b] = [0, chroma, x];
  else if (h < 4 / 6) [r, g, b] = [0, x, chroma];
  else if (h < 5 / 6) [r, g, b] = [x, 0, chroma];
  else [r, g, b] = [chroma, 0, x];

  return rgbToHex({ r: (r + match) * 255, g: (g + match) * 255, b: (b + match) * 255 });
}

function hueOffsets(mode: HarmonyMode): number[] {
  if (mode === "complementary") return [0, 18, 180, 198, 342];
  if (mode === "analogous") return [-48, -24, 0, 24, 48];
  if (mode === "triadic") return [0, 120, 240, 30, 210];
  return [0, 46, 123, 203, 282];
}

export function buildPalette(base: string, mode: HarmonyMode = "random"): string[] {
  const { h, s, l } = rgbToHsl(hexToRgb(base));
  const offsets = hueOffsets(mode);
  const lightness = [clamp(l + 25), clamp(l + 10), l, clamp(l - 12), clamp(l - 27)];
  const saturation = [clamp(s - 25), clamp(s - 8), s, clamp(s + 4), clamp(s - 14)];

  return offsets.map((offset, index) => hslToHex(h + offset, saturation[index], lightness[index]));
}

function channelLuminance(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(color: string): number {
  const { r, g, b } = hexToRgb(color);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

export function contrastRatio(first: string, second: string): number {
  const one = relativeLuminance(first);
  const two = relativeLuminance(second);
  return Number(((Math.max(one, two) + 0.05) / (Math.min(one, two) + 0.05)).toFixed(2));
}

export function contrastLevel(ratio: number): "AAA" | "AA" | "Fail" {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  return "Fail";
}

export function accessibleForeground(background: string, minimum = 4.5): string {
  const { h, s } = rgbToHsl(hexToRgb(background));
  const candidates = Array.from({ length: 101 }, (_, lightness) => hslToHex(h, s, lightness));
  const valid = candidates.filter((candidate) => contrastRatio(candidate, background) >= minimum);
  if (valid.length === 0) return relativeLuminance(background) > 0.5 ? "#000000" : "#FFFFFF";
  return valid.reduce((closest, candidate) => {
    const source = rgbToHsl(hexToRgb(background)).l;
    const currentDelta = Math.abs(rgbToHsl(hexToRgb(candidate)).l - source);
    const closestDelta = Math.abs(rgbToHsl(hexToRgb(closest)).l - source);
    return currentDelta < closestDelta ? candidate : closest;
  });
}

export function rgbString(color: string): string {
  const { r, g, b } = hexToRgb(color);
  return `rgb(${r}, ${g}, ${b})`;
}

export function hslString(color: string): string {
  const { h, s, l } = rgbToHsl(hexToRgb(color));
  return `hsl(${h} ${s}% ${l}%)`;
}

export function gradientCss(colors: string[], angle = 135, type: "linear" | "radial" = "linear"): string {
  const usable = colors.filter(Boolean).map(normaliseHex);
  if (usable.length < 2) throw new Error("Adicione pelo menos duas cores ao gradiente.");
  return type === "radial"
    ? `radial-gradient(circle at center, ${usable.join(", ")})`
    : `linear-gradient(${Math.round(angle)}deg, ${usable.join(", ")})`;
}

export function typographyScale(base: number, ratio: number, steps = 6, lineHeight = 1.4): Array<{ token: string; px: number; rem: string; lineHeight: string }> {
  return Array.from({ length: steps }, (_, index) => {
    const px = Number((base * ratio ** index).toFixed(2));
    return { token: `--type-${index + 1}`, px, rem: `${(px / 16).toFixed(3)}rem`, lineHeight: `${lineHeight}` };
  });
}

export type ShadowLayer = {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
};

type TextShadow = Omit<ShadowLayer, "spread" | "inset">;

export function cssColor(color: string, opacity = 1): string {
  const { r, g, b } = hexToRgb(color);
  return `rgb(${r} ${g} ${b} / ${Number(clamp(opacity, 0, 1).toFixed(2))})`;
}

export function textShadowCss({ x, y, blur, color, opacity }: TextShadow): string {
  return `${Math.round(x)}px ${Math.round(y)}px ${Math.max(0, Math.round(blur))}px ${cssColor(color, opacity)}`;
}

export function boxShadowCss(layers: ShadowLayer[]): string {
  return layers.map(({ x, y, blur, spread, color, opacity, inset }) => `${inset ? "inset " : ""}${Math.round(x)}px ${Math.round(y)}px ${Math.max(0, Math.round(blur))}px ${Math.round(spread)}px ${cssColor(color, opacity)}`).join(", ");
}

export function borderRadiusCss(corners: number[]): string {
  return corners.slice(0, 4).map((corner) => `${Math.max(0, Math.round(corner))}px`).join(" ");
}

export function createPrompt(input: { niche: string; style: string; colors: string; goal: string; difficulty: string }, seed = 0): string {
  const structures = [
    "Crie uma peça principal que conduza o olhar de longe para perto.",
    "Comece pela hierarquia e deixe os detalhes trazerem a personalidade.",
    "Use contraste de escala para transformar uma ideia simples em uma composição memorável."
  ];
  const focus = ["um elemento tátil", "uma tipografia expressiva", "um recorte inesperado"];
  const index = Math.abs(seed) % structures.length;
  return `Briefing ${input.difficulty}: desenvolva uma proposta de ${input.niche} com estética ${input.style}. O objetivo é ${input.goal}. Trabalhe a paleta ${input.colors} e dê prioridade a ${focus[index]}. ${structures[index]}`;
}

export function makeSvgShape(kind: "wave" | "blob" | "circle" | "polygon", intensity = 45, sides = 6): string {
  const safeIntensity = clamp(intensity, 0, 100);
  if (kind === "circle") return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><circle cx="200" cy="120" r="96" fill="currentColor"/></svg>';
  if (kind === "polygon") {
    const count = Math.max(3, Math.min(12, Math.round(sides)));
    const points = Array.from({ length: count }, (_, index) => {
      const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
      return `${(200 + Math.cos(angle) * 98).toFixed(1)},${(120 + Math.sin(angle) * 98).toFixed(1)}`;
    }).join(" ");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><polygon points="${points}" fill="currentColor"/></svg>`;
  }
  if (kind === "blob") {
    const wobble = safeIntensity * 0.55;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><path d="M77 ${120 - wobble}C77 50 143 ${28 + wobble} 205 42c60-18 120 24 112 88 8 62-54 98-113 82-66 21-133-19-127-92Z" fill="currentColor"/></svg>`;
  }
  const peak = 70 + safeIntensity * 0.45;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" preserveAspectRatio="none"><path d="M0 ${120} C70 ${120 - peak}, 130 ${120 + peak}, 200 120 S330 ${120 - peak}, 400 120 V240H0Z" fill="currentColor"/></svg>`;
}

export function patternCss(kind: "dots" | "lines" | "grid" | "checks", color: string, size = 24): string {
  const ink = normaliseHex(color);
  const unit = Math.max(4, Math.round(size));
  if (kind === "dots") return `radial-gradient(${ink} 1.5px, transparent 1.5px) 0 0 / ${unit}px ${unit}px`;
  if (kind === "lines") return `repeating-linear-gradient(45deg, ${ink} 0 1px, transparent 1px ${unit}px)`;
  if (kind === "checks") return `conic-gradient(${ink} 25%, transparent 0 50%, ${ink} 0 75%, transparent 0) 0 0 / ${unit}px ${unit}px`;
  return `linear-gradient(${ink} 1px, transparent 1px), linear-gradient(90deg, ${ink} 1px, transparent 1px) 0 0 / ${unit}px ${unit}px`;
}

export type SocialCanvasFormat = "square" | "portrait" | "story" | "landscape";

export function socialCanvasDimensions(format: SocialCanvasFormat): { width: number; height: number; label: string } {
  if (format === "portrait") return { width: 1080, height: 1350, label: "1080 × 1350" };
  if (format === "story") return { width: 1080, height: 1920, label: "1080 × 1920" };
  if (format === "landscape") return { width: 1200, height: 628, label: "1200 × 628" };
  return { width: 1080, height: 1080, label: "1080 × 1080" };
}
