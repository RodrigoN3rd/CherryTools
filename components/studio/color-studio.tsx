"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Check, Copy, Download, Lock, LockKeyholeOpen, RefreshCw } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools/catalog";
import {
  accessibleForeground, buildPalette, contrastLevel, contrastRatio, gradientCss, hslString, hslToHex, normaliseHex, rgbString,
  type HarmonyMode
} from "@/lib/tools/algorithms";
import { copyText, downloadText, fileToImage } from "./browser-utils";
import { PngDownloadAction } from "./design-actions";

type ColorToolKind = Extract<ToolDefinition["kind"], "palette" | "extractor" | "gradient" | "contrast" | "harmony">;
type Props = { tool: ToolDefinition & { kind: ColorToolKind } };

function CopyButton({ value, label = "Copiar" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  const handleCopy = async () => {
    await copyText(value);
    setDone(true);
    window.setTimeout(() => setDone(false), 1600);
  };
  return <button className="button button-quiet button-small" type="button" onClick={handleCopy}>{done ? <Check size={14} /> : <Copy size={14} />}{done ? "Copiado" : label}</button>;
}

function ColorValue({ color, onChange }: { color: string; onChange?: (color: string) => void }) {
  return <div className="color-value"><input aria-label={`Escolher ${color}`} type="color" value={color} onChange={(event) => onChange?.(event.target.value.toUpperCase())} /><code>{color}</code><CopyButton value={color} label="" /></div>;
}

function drawPaletteCanvas(context: CanvasRenderingContext2D, width: number, height: number, colors: string[]) {
  const cardWidth = width / colors.length;
  colors.forEach((color, index) => {
    context.fillStyle = color;
    context.fillRect(index * cardWidth, 0, cardWidth, height);
    context.fillStyle = contrastRatio(color, "#FFFFFF") >= 4.5 ? "#FFFFFF" : "#352A2D";
    context.font = '800 28px "DM Sans", sans-serif';
    context.fillText(color, index * cardWidth + 42, height - 102);
    context.font = '600 20px "DM Sans", sans-serif';
    context.fillText(rgbString(color), index * cardWidth + 42, height - 64);
  });
}

function drawGradientCanvas(context: CanvasRenderingContext2D, width: number, height: number, colors: string[], angle: number, type: "linear" | "radial") {
  const radians = (angle * Math.PI) / 180;
  const gradient = type === "linear"
    ? context.createLinearGradient(width / 2 - Math.cos(radians) * width / 2, height / 2 - Math.sin(radians) * height / 2, width / 2 + Math.cos(radians) * width / 2, height / 2 + Math.sin(radians) * height / 2)
    : context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 1.4);
  colors.forEach((color, index) => gradient.addColorStop(index / Math.max(1, colors.length - 1), color));
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "rgb(255 252 250 / .78)";
  context.fillRect(72, 72, 430, 112);
  context.fillStyle = "#622E3B";
  context.font = '800 25px "DM Sans", sans-serif';
  context.fillText("GRADIENTE CHERRY", 108, 120);
  context.font = '600 20px "DM Sans", sans-serif';
  context.fillText(`${type} · ${angle}°`, 108, 156);
}

function drawContrastCanvas(context: CanvasRenderingContext2D, width: number, height: number, foreground: string, background: string, ratio: number, level: string) {
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  context.fillStyle = foreground;
  context.textAlign = "center";
  context.font = '400 240px "Instrument Serif", serif';
  context.fillText(`${ratio}:1`, width / 2, height / 2 - 20);
  context.font = '800 38px "DM Sans", sans-serif';
  context.fillText(level === "Fail" ? "AJUSTE NECESSÁRIO" : `${level} PARA TEXTO`, width / 2, height / 2 + 76);
  context.font = '500 26px "DM Sans", sans-serif';
  context.fillText("Um pequeno texto precisa continuar confortável de ler.", width / 2, height / 2 + 138);
  context.textAlign = "left";
}

function drawHarmonyCanvas(context: CanvasRenderingContext2D, width: number, height: number, colors: string[], base: string, mode: string) {
  const cx = width / 2;
  const cy = height / 2 - 20;
  const radius = 300;
  colors.forEach((color, index) => {
    context.beginPath();
    context.moveTo(cx, cy);
    context.arc(cx, cy, radius, -Math.PI / 2 + index * Math.PI * 2 / colors.length, -Math.PI / 2 + (index + 1) * Math.PI * 2 / colors.length);
    context.closePath();
    context.fillStyle = color;
    context.fill();
  });
  context.beginPath();
  context.arc(cx, cy, 110, 0, Math.PI * 2);
  context.fillStyle = base;
  context.fill();
  context.fillStyle = "#352A2D";
  context.font = '800 25px "DM Sans", sans-serif';
  context.fillText(`HARMONIA ${mode.toUpperCase()}`, 78, 94);
  colors.forEach((color, index) => { context.fillStyle = color; context.fillRect(76 + index * 290, height - 104, 245, 38); });
}

function PaletteStudio() {
  const [base, setBase] = useState("#B83B4B");
  const [mode, setMode] = useState<HarmonyMode>("analogous");
  const [colors, setColors] = useState(() => buildPalette(base, mode));
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false]);
  const [status, setStatus] = useState("");

  const generate = (nextBase = base, nextMode = mode) => {
    const palette = buildPalette(nextBase, nextMode);
    setColors((current) => palette.map((color, index) => locked[index] ? current[index] : color));
  };
  const randomise = () => {
    const next = hslToHex(Math.floor(Math.random() * 360), 45 + Math.floor(Math.random() * 45), 38 + Math.floor(Math.random() * 25));
    setBase(next);
    generate(next, mode);
    setStatus("Nova paleta pronta.");
  };
  const css = `:root {\n${colors.map((color, index) => `  --cherry-color-${index + 1}: ${color};`).join("\n")}\n}`;

  return <div className="workspace workspace--wide">
    <section className="panel" aria-label="Controles da paleta">
      <h2>Comece por uma cor</h2><p className="panel-help">Trave o que funciona e gere o resto ao redor dela.</p>
      <div className="field"><label htmlFor="palette-base">Cor base</label><input id="palette-base" type="color" value={base} onChange={(event) => { const next = event.target.value.toUpperCase(); setBase(next); generate(next); }} /></div>
      <div className="field"><label htmlFor="palette-mode">Relação</label><select id="palette-mode" value={mode} onChange={(event) => { const next = event.target.value as HarmonyMode; setMode(next); generate(base, next); }}><option value="random">Livre</option><option value="analogous">Análoga</option><option value="complementary">Complementar</option><option value="triadic">Triádica</option></select></div>
      <div className="control-actions"><button className="button button-primary" type="button" onClick={randomise}><RefreshCw size={15} /> Outra paleta</button><button className="button button-quiet" type="button" onClick={() => downloadText("cherry-palette.json", JSON.stringify({ colors }, null, 2), "application/json")}><Download size={15} /> JSON</button><PngDownloadAction filename="cherry-palette.png" draw={(context, width, height) => drawPaletteCanvas(context, width, height, colors)} /></div>
      <p className="status status--success" role="status">{status}</p>
    </section>
    <section className="panel preview-panel" aria-label="Sua paleta de cores">
      <div className="palette-preview">{colors.map((color, index) => <article className="swatch-card" style={{ background: color, color: contrastRatio(color, "#FFFFFF") >= 4.5 ? "#FFFFFF" : "#352A2D" }} key={`${color}-${index}`}><button className="swatch-lock" type="button" onClick={() => setLocked((current) => current.map((item, itemIndex) => itemIndex === index ? !item : item))} aria-label={locked[index] ? `Destravar cor ${index + 1}` : `Travar cor ${index + 1}`}>{locked[index] ? <Lock size={15} /> : <LockKeyholeOpen size={15} />}</button><button className="swatch-copy" type="button" onClick={() => copyText(color)}>{color}</button><span>{rgbString(color)}</span></article>)}</div>
    </section>
    <section className="panel"><h2>Para o seu CSS</h2><p className="panel-help">Uma variável para cada decisão de cor.</p><pre className="code-block">{css}</pre><div className="control-actions"><CopyButton value={css} label="Copiar CSS" /><button className="button button-quiet button-small" type="button" onClick={() => downloadText("cherry-palette.css", css, "text/css")}><Download size={14} /> Baixar</button></div></section>
  </div>;
}

function ImageExtractor() {
  const [colors, setColors] = useState<string[]>([]);
  const [status, setStatus] = useState("Escolha uma imagem para começar.");
  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setStatus("Lendo as cores dominantes…");
      const image = await fileToImage(file);
      const scale = Math.min(1, 200 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("O canvas não está disponível.");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      const tally = new Map<string, number>();
      for (let index = 0; index < data.length; index += 16) {
        if (data[index + 3] < 180) continue;
        const channel = (value: number) => Math.min(255, Math.round(value / 32) * 32).toString(16).padStart(2, "0");
        const color = `#${channel(data[index])}${channel(data[index + 1])}${channel(data[index + 2])}`.toUpperCase();
        tally.set(color, (tally.get(color) ?? 0) + 1);
      }
      const next = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([color]) => color);
      setColors(next);
      setStatus(`${next.length} cores encontradas em ${file.name}.`);
    } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível ler esta imagem."); }
  };
  return <div className="workspace workspace--wide"><section className="panel"><h2>Imagem de referência</h2><p className="panel-help">O processamento acontece neste dispositivo.</p><div className="field"><label htmlFor="extract-image">Arquivo PNG, JPG, WEBP ou AVIF</label><input id="extract-image" type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={onFile} /></div><p className="status" role="status">{status}</p></section><section className="panel preview-panel"><div className="extracted-grid" aria-live="polite">{colors.length ? colors.map((color) => <div className="extract-swatch" key={color} style={{ background: color }}><ColorValue color={color} /></div>) : <p className="empty-note">A paleta aparecerá aqui.</p>}</div></section><section className="panel"><h2>Leve a paleta</h2><p className="panel-help">Os códigos aparecem em HEX e podem ser copiados individualmente.</p><div className="control-actions"><button className="button button-quiet" type="button" disabled={!colors.length} onClick={() => downloadText("cherry-image-palette.json", JSON.stringify({ colors }, null, 2), "application/json")}><Download size={15} /> Exportar JSON</button><PngDownloadAction filename="cherry-image-palette.png" disabled={!colors.length} draw={(context, width, height) => drawPaletteCanvas(context, width, height, colors)} /></div></section></div>;
}

function GradientStudio() {
  const [colors, setColors] = useState(["#B83B4B", "#E9A3AD", "#FFF8F1"]);
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<"linear" | "radial">("linear");
  const css = useMemo(() => `background: ${gradientCss(colors, angle, type)};`, [colors, angle, type]);
  return <div className="workspace"><section className="panel"><h2>Receita do gradiente</h2><p className="panel-help">Adicione até quatro pontos de cor.</p><div className="field"><label htmlFor="gradient-type">Tipo</label><select id="gradient-type" value={type} onChange={(event) => setType(event.target.value as "linear" | "radial")}><option value="linear">Linear</option><option value="radial">Radial</option></select></div>{colors.map((color, index) => <div className="field" key={`${color}-${index}`}><label htmlFor={`gradient-color-${index}`}>Cor {index + 1}</label><input id={`gradient-color-${index}`} type="color" value={color} onChange={(event) => setColors((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value.toUpperCase() : item))} /></div>)}<button className="button button-quiet button-small" type="button" disabled={colors.length === 4} onClick={() => setColors((current) => [...current, "#622E3B"])}>Adicionar cor</button>{type === "linear" && <div className="range-field"><label htmlFor="gradient-angle">Ângulo</label><output>{angle}°</output><input id="gradient-angle" type="range" min="0" max="360" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></div>}</section><section className="panel preview-panel"><div className="gradient-stage" style={{ background: gradientCss(colors, angle, type) }}><span>Cor em movimento</span></div></section><section className="panel"><h2>CSS pronto</h2><pre className="code-block">{css}</pre><div className="control-actions"><CopyButton value={css} label="Copiar CSS" /><button className="button button-quiet button-small" type="button" onClick={() => downloadText("cherry-gradient.css", css, "text/css")}><Download size={14} /> Baixar</button><PngDownloadAction filename="cherry-gradient.png" draw={(context, width, height) => drawGradientCanvas(context, width, height, colors, angle, type)} /></div></section></div>;
}

function ContrastStudio() {
  const [foreground, setForeground] = useState("#622E3B");
  const [background, setBackground] = useState("#FFF8F1");
  const ratio = contrastRatio(foreground, background);
  const level = contrastLevel(ratio);
  const suggestion = accessibleForeground(background);
  return <div className="workspace"><section className="panel"><h2>Par de cores</h2><p className="panel-help">Mede texto normal conforme WCAG 2.1.</p><div className="field"><label htmlFor="contrast-foreground">Texto</label><input id="contrast-foreground" type="color" value={foreground} onChange={(event) => setForeground(event.target.value.toUpperCase())} /></div><div className="field"><label htmlFor="contrast-background">Fundo</label><input id="contrast-background" type="color" value={background} onChange={(event) => setBackground(event.target.value.toUpperCase())} /></div><div className="control-actions"><button className="button button-quiet button-small" type="button" onClick={() => { setForeground(background); setBackground(foreground); }}>Inverter</button></div></section><section className="panel preview-panel"><div className="contrast-stage" style={{ color: foreground, background }}><span className="contrast-score">{ratio}:1</span><strong>{level === "Fail" ? "Ajuste necessário" : `${level} para texto`}</strong><p>Um pequeno texto precisa continuar confortável de ler.</p></div></section><section className="panel"><h2>Próximo ajuste</h2><p className="panel-help">{level === "Fail" ? "Esta alternativa alcança AA sobre o fundo atual." : "Este par atende a leitura normal."}</p><ColorValue color={level === "Fail" ? suggestion : foreground} onChange={level === "Fail" ? setForeground : undefined} /><pre className="code-block">{`color: ${foreground};\nbackground: ${background};`}</pre><div className="control-actions"><CopyButton value={`color: ${foreground};\nbackground: ${background};`} label="Copiar CSS" /><PngDownloadAction filename="cherry-contrast.png" draw={(context, width, height) => drawContrastCanvas(context, width, height, foreground, background, ratio, level)} /></div></section></div>;
}

function HarmonyStudio() {
  const [base, setBase] = useState("#B83B4B");
  const [mode, setMode] = useState<HarmonyMode>("triadic");
  const colors = buildPalette(base, mode);
  return <div className="workspace workspace--wide"><section className="panel"><h2>Centro da roda</h2><p className="panel-help">Escolha uma cor e a relação que quer investigar.</p><div className="field"><label htmlFor="harmony-base">Cor</label><input id="harmony-base" type="color" value={base} onChange={(event) => setBase(event.target.value.toUpperCase())} /></div><div className="field"><label htmlFor="harmony-mode">Harmonia</label><select id="harmony-mode" value={mode} onChange={(event) => setMode(event.target.value as HarmonyMode)}><option value="complementary">Complementar</option><option value="analogous">Análoga</option><option value="triadic">Triádica</option></select></div></section><section className="panel preview-panel"><div className="harmony-wheel" style={{ background: `conic-gradient(from 0deg, ${colors.join(", ")}, ${colors[0]})` }}><span style={{ background: base }} /></div><div className="harmony-strip">{colors.map((color) => <ColorValue color={color} key={color} />)}</div></section><section className="panel"><h2>Detalhes da cor</h2><p className="panel-help">Clique em um HEX para copiá-lo.</p>{colors.map((color) => <div className="color-line" key={`${color}-data`}><span style={{ background: color }} /><code>{color}</code><small>{hslString(color)}</small></div>)}<div className="control-actions"><PngDownloadAction filename="cherry-harmony.png" draw={(context, width, height) => drawHarmonyCanvas(context, width, height, colors, base, mode)} /></div></section></div>;
}

export function ColorStudio({ tool }: Props) {
  if (tool.kind === "palette") return <PaletteStudio />;
  if (tool.kind === "extractor") return <ImageExtractor />;
  if (tool.kind === "gradient") return <GradientStudio />;
  if (tool.kind === "contrast") return <ContrastStudio />;
  return <HarmonyStudio />;
}
