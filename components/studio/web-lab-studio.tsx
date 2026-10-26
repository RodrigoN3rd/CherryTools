"use client";

import { useCallback, useState, type RefObject } from "react";
import { Download } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools/catalog";
import { useCanvasPng, type CanvasDraw } from "./canvas-export";

type StaticWebKind = Extract<ToolDefinition["kind"], "layout-grid" | "button-studio" | "glass-surface" | "mesh-gradient" | "hero-composer" | "device-mockup">;
type Props = { tool: ToolDefinition & { kind: StaticWebKind } };

function Range({ id, label, value, min, max, step = 1, suffix = "", onChange }: { id: string; label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (value: number) => void }) {
  return <div className="range-field"><label htmlFor={id}>{label}</label><output>{value}{suffix}</output><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></div>;
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (current && context.measureText(next).width > maxWidth) {
      lines.push(current);
      current = word;
    } else current = next;
  });
  if (current) lines.push(current);
  return lines.length ? lines : [" "];
}

function CanvasPreview({ canvasRef, label, status, onDownload }: { canvasRef: RefObject<HTMLCanvasElement | null>; label: string; status: string; onDownload: () => void }) {
  return <section className="panel preview-panel canvas-preview-panel"><canvas ref={canvasRef} width={1600} height={1000} className="design-canvas" role="img" aria-label={label}>A prévia será renderizada aqui.</canvas><div className="canvas-preview-actions"><button className="button button-primary button-small" type="button" onClick={onDownload}><Download size={14} /> Baixar PNG</button>{status && <p className="status" role="status">{status}</p>}</div></section>;
}

function LayoutGridStudio() {
  const [columns, setColumns] = useState(12);
  const [gutter, setGutter] = useState(24);
  const [margin, setMargin] = useState(86);
  const [showBaseline, setShowBaseline] = useState(true);
  const draw = useCallback<CanvasDraw>((context, width, height) => {
    context.fillStyle = "#FFF8F1";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#352A2D";
    context.font = '800 25px "DM Sans", sans-serif';
    context.fillText("GRID DE LAYOUT", margin, 90);
    context.font = '600 21px "DM Sans", sans-serif';
    context.fillStyle = "#746468";
    context.fillText(`${columns} colunas · respiro de ${gutter}px`, margin, 126);
    const top = 190;
    const bottom = height - 110;
    const available = width - margin * 2;
    const columnWidth = (available - gutter * (columns - 1)) / columns;
    if (showBaseline) {
      context.strokeStyle = "rgb(184 59 75 / .14)";
      context.lineWidth = 1;
      for (let y = top; y <= bottom; y += 24) {
        context.beginPath();
        context.moveTo(margin, y);
        context.lineTo(width - margin, y);
        context.stroke();
      }
    }
    for (let index = 0; index < columns; index += 1) {
      const x = margin + index * (columnWidth + gutter);
      context.fillStyle = index % 2 ? "rgb(233 163 173 / .48)" : "rgb(184 59 75 / .14)";
      context.fillRect(x, top, columnWidth, bottom - top);
      context.fillStyle = "#B83B4B";
      context.font = '800 18px "DM Sans", sans-serif';
      context.textAlign = "center";
      context.fillText(String(index + 1).padStart(2, "0"), x + columnWidth / 2, top + 34);
    }
    context.textAlign = "left";
    context.strokeStyle = "#B83B4B";
    context.lineWidth = 3;
    context.strokeRect(margin, top, available, bottom - top);
  }, [columns, gutter, margin, showBaseline]);
  const { canvasRef, downloadPng, status } = useCanvasPng({ width: 1600, height: 1000, filename: "cherry-layout-grid.png", draw });
  return <div className="workspace"><section className="panel"><h2>Estrutura antes da decoração</h2><p className="panel-help">Veja a largura real de cada coluna e use a linha-base para segurar o ritmo vertical.</p><Range id="layout-grid-columns" label="Colunas" value={columns} min={2} max={16} onChange={setColumns} /><Range id="layout-grid-gutter" label="Gutter" value={gutter} min={8} max={64} suffix="px" onChange={setGutter} /><Range id="layout-grid-margin" label="Margem" value={margin} min={36} max={180} suffix="px" onChange={setMargin} /><label className="check-field"><input id="layout-grid-baseline" type="checkbox" checked={showBaseline} onChange={(event) => setShowBaseline(event.target.checked)} /> Mostrar linha-base</label></section><CanvasPreview canvasRef={canvasRef} label="Prévia de grid de layout" status={status} onDownload={downloadPng} /></div>;
}

function ButtonStudio() {
  const [label, setLabel] = useState("Começar agora");
  const [style, setStyle] = useState<"solid" | "outline" | "soft">("solid");
  const [radius, setRadius] = useState(999);
  const [accent, setAccent] = useState("#B83B4B");
  const draw = useCallback<CanvasDraw>((context, width, height) => {
    context.fillStyle = "#FFF8F1";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#352A2D";
    context.font = '800 25px "DM Sans", sans-serif';
    context.fillText("ESTÚDIO DE BOTÕES", 105, 112);
    const buttonWidth = Math.min(width - 260, Math.max(420, 180 + label.length * 34));
    const x = (width - buttonWidth) / 2;
    const y = height / 2 - 62;
    const fill = style === "solid" ? accent : style === "soft" ? "#F6DDE2" : "#FFF8F1";
    roundedRect(context, x, y, buttonWidth, 124, Math.min(radius, 62));
    context.fillStyle = fill;
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = accent;
    if (style !== "solid") context.stroke();
    if (style === "solid") {
      context.shadowColor = "rgb(98 46 59 / .25)";
      context.shadowBlur = 20;
      context.shadowOffsetY = 12;
      context.fill();
      context.shadowColor = "transparent";
    }
    context.fillStyle = style === "solid" ? "#FFF8F1" : accent;
    context.font = '750 34px "DM Sans", sans-serif';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(label || "Botão", width / 2 - 14, height / 2);
    context.font = '700 38px "DM Sans", sans-serif';
    context.fillText("→", x + buttonWidth - 52, height / 2);
    context.textBaseline = "alphabetic";
    context.font = '600 23px "DM Sans", sans-serif';
    context.fillStyle = "#746468";
    context.fillText(`variante ${style} · raio ${radius}px`, width / 2, height - 136);
  }, [accent, label, radius, style]);
  const { canvasRef, downloadPng, status } = useCanvasPng({ width: 1600, height: 1000, filename: "cherry-button-studio.png", draw });
  return <div className="workspace"><section className="panel"><h2>Uma ação com presença</h2><p className="panel-help">Testar o botão sozinho ajuda a sentir proporção, contraste e área de toque.</p><div className="field"><label htmlFor="button-label">Texto</label><input id="button-label" maxLength={28} value={label} onChange={(event) => setLabel(event.target.value)} /></div><div className="field"><label htmlFor="button-style">Variante</label><select id="button-style" value={style} onChange={(event) => setStyle(event.target.value as typeof style)}><option value="solid">Sólido</option><option value="outline">Contorno</option><option value="soft">Suave</option></select></div><Range id="button-radius" label="Raio" value={radius} min={0} max={999} suffix="px" onChange={setRadius} /><div className="field"><label htmlFor="button-accent">Cor de ação</label><input id="button-accent" type="color" value={accent} onChange={(event) => setAccent(event.target.value.toUpperCase())} /></div></section><CanvasPreview canvasRef={canvasRef} label="Prévia de botão de interface" status={status} onDownload={downloadPng} /></div>;
}

function GlassSurfaceStudio() {
  const [opacity, setOpacity] = useState(.54);
  const [blur, setBlur] = useState(22);
  const [tint, setTint] = useState("#F6DDE2");
  const draw = useCallback<CanvasDraw>((context, width, height) => {
    const base = context.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, "#622E3B");
    base.addColorStop(.48, "#B83B4B");
    base.addColorStop(1, "#E9A3AD");
    context.fillStyle = base;
    context.fillRect(0, 0, width, height);
    context.filter = `blur(${blur}px)`;
    [[.17, .2, "#FFE5A9"], [.78, .28, "#B7E4D1"], [.58, .82, "#A5C8F1"]].forEach(([x, y, color]) => {
      context.fillStyle = color as string;
      context.beginPath();
      context.arc(width * Number(x), height * Number(y), 165, 0, Math.PI * 2);
      context.fill();
    });
    context.filter = "none";
    const cardWidth = width * .7;
    const cardHeight = height * .5;
    const cardX = (width - cardWidth) / 2;
    const cardY = (height - cardHeight) / 2;
    roundedRect(context, cardX, cardY, cardWidth, cardHeight, 46);
    context.globalAlpha = opacity;
    context.fillStyle = tint;
    context.fill();
    context.globalAlpha = 1;
    context.lineWidth = 3;
    context.strokeStyle = `rgb(255 255 255 / ${Math.min(.9, opacity + .26)})`;
    context.stroke();
    context.fillStyle = "#352A2D";
    context.font = '800 25px "DM Sans", sans-serif';
    context.fillText("SUPERFÍCIE DE VIDRO", cardX + 64, cardY + 94);
    context.font = '400 89px "Instrument Serif", serif';
    context.fillText("Luz, ar", cardX + 64, cardY + 200);
    context.fillText("e profundidade.", cardX + 64, cardY + 294);
    context.font = '600 23px "DM Sans", sans-serif';
    context.fillStyle = "#622E3B";
    context.fillText(`opacidade ${Math.round(opacity * 100)}% · blur ${blur}px`, cardX + 64, cardY + cardHeight - 74);
  }, [blur, opacity, tint]);
  const { canvasRef, downloadPng, status } = useCanvasPng({ width: 1600, height: 1000, filename: "cherry-glass-surface.png", draw });
  return <div className="workspace"><section className="panel"><h2>Transparência com contraste</h2><p className="panel-help">A superfície mantém o conteúdo legível enquanto deixa a cor do fundo respirar.</p><Range id="glass-opacity" label="Opacidade" value={opacity} min={.15} max={.88} step={.01} onChange={setOpacity} /><Range id="glass-blur" label="Desfoque de fundo" value={blur} min={0} max={48} suffix="px" onChange={setBlur} /><div className="field"><label htmlFor="glass-tint">Matiz</label><input id="glass-tint" type="color" value={tint} onChange={(event) => setTint(event.target.value.toUpperCase())} /></div></section><CanvasPreview canvasRef={canvasRef} label="Prévia de superfície de vidro" status={status} onDownload={downloadPng} /></div>;
}

function MeshGradientStudio() {
  const [colors, setColors] = useState(["#B83B4B", "#F2BE80", "#A7D8CB", "#A7B8E8"]);
  const draw = useCallback<CanvasDraw>((context, width, height) => {
    context.fillStyle = "#FFF8F1";
    context.fillRect(0, 0, width, height);
    const points = [[.18, .25], [.78, .22], [.22, .76], [.76, .76]];
    context.globalCompositeOperation = "multiply";
    colors.forEach((color, index) => {
      const gradient = context.createRadialGradient(width * points[index][0], height * points[index][1], 0, width * points[index][0], height * points[index][1], width * .55);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "rgb(255 248 241 / 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    });
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "rgb(255 255 255 / .72)";
    roundedRect(context, 85, 80, 420, 122, 28);
    context.fill();
    context.fillStyle = "#352A2D";
    context.font = '800 25px "DM Sans", sans-serif';
    context.fillText("MESH GRADIENT", 123, 132);
    context.font = '600 20px "DM Sans", sans-serif';
    context.fillStyle = "#746468";
    context.fillText("quatro pontos, um campo de cor", 123, 169);
  }, [colors]);
  const { canvasRef, downloadPng, status } = useCanvasPng({ width: 1600, height: 1000, filename: "cherry-mesh-gradient.png", draw });
  return <div className="workspace"><section className="panel"><h2>Pontos de cor</h2><p className="panel-help">Alterne cada ponto e observe a mistura. O PNG sai na mesma resolução da prévia.</p><div className="color-pick-grid">{colors.map((color, index) => <div className="field" key={index}><label htmlFor={`mesh-color-${index}`}>Ponto {index + 1}</label><input id={`mesh-color-${index}`} type="color" value={color} onChange={(event) => setColors((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value.toUpperCase() : item))} /></div>)}</div></section><CanvasPreview canvasRef={canvasRef} label="Prévia de gradiente mesh" status={status} onDownload={downloadPng} /></div>;
}

function HeroComposerStudio() {
  const [headline, setHeadline] = useState("Uma presença que convida a ficar.");
  const [supporting, setSupporting] = useState("Construa uma primeira impressão clara, generosa e feita para pessoas.");
  const [accent, setAccent] = useState("#B83B4B");
  const [align, setAlign] = useState<"left" | "center">("left");
  const draw = useCallback<CanvasDraw>((context, width, height) => {
    context.fillStyle = "#FFF8F1";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#F6DDE2";
    context.beginPath();
    context.arc(width * .83, height * .28, width * .22, 0, Math.PI * 2);
    context.fill();
    const x = align === "left" ? 128 : width / 2;
    context.textAlign = align;
    context.fillStyle = accent;
    context.font = '800 23px "DM Sans", sans-serif';
    context.fillText("UM PEQUENO ESTÚDIO DIGITAL", x, 170);
    context.fillStyle = "#352A2D";
    context.font = '400 104px "Instrument Serif", serif';
    const headlineLines = wrapText(context, headline, align === "left" ? width * .55 : width * .72).slice(0, 3);
    headlineLines.forEach((line, index) => context.fillText(line, x, 315 + index * 108));
    context.font = '500 29px "DM Sans", sans-serif';
    context.fillStyle = "#746468";
    const supportingLines = wrapText(context, supporting, align === "left" ? width * .48 : width * .6).slice(0, 3);
    supportingLines.forEach((line, index) => context.fillText(line, x, 688 + index * 40));
    const buttonWidth = 260;
    const buttonX = align === "left" ? x : x - buttonWidth / 2;
    roundedRect(context, buttonX, height - 176, buttonWidth, 74, 37);
    context.fillStyle = accent;
    context.fill();
    context.fillStyle = "#FFF8F1";
    context.font = '750 24px "DM Sans", sans-serif';
    context.fillText("Conhecer o projeto →", align === "left" ? buttonX + 28 : x, height - 130);
    context.textAlign = "left";
  }, [accent, align, headline, supporting]);
  const { canvasRef, downloadPng, status } = useCanvasPng({ width: 1600, height: 1000, filename: "cherry-hero-composer.png", draw });
  return <div className="workspace"><section className="panel"><h2>Primeira impressão</h2><p className="panel-help">A hero oferece contexto, uma frase forte e um próximo passo sem disputar atenção.</p><div className="field"><label htmlFor="hero-headline">Título</label><textarea id="hero-headline" maxLength={90} value={headline} onChange={(event) => setHeadline(event.target.value)} /></div><div className="field"><label htmlFor="hero-supporting">Apoio</label><textarea id="hero-supporting" maxLength={150} value={supporting} onChange={(event) => setSupporting(event.target.value)} /></div><div className="field"><label htmlFor="hero-align">Alinhamento</label><select id="hero-align" value={align} onChange={(event) => setAlign(event.target.value as typeof align)}><option value="left">À esquerda</option><option value="center">Centralizado</option></select></div><div className="field"><label htmlFor="hero-accent">Cor de ação</label><input id="hero-accent" type="color" value={accent} onChange={(event) => setAccent(event.target.value.toUpperCase())} /></div></section><CanvasPreview canvasRef={canvasRef} label="Prévia de hero section" status={status} onDownload={downloadPng} /></div>;
}

function DeviceMockupStudio() {
  const [device, setDevice] = useState<"phone" | "tablet" | "browser">("phone");
  const [accent, setAccent] = useState("#B83B4B");
  const [title, setTitle] = useState("Um gesto por vez.");
  const draw = useCallback<CanvasDraw>((context, width, height) => {
    context.fillStyle = "#F6DDE2";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#FFF8F1";
    context.beginPath();
    context.arc(width * .84, height * .18, 210, 0, Math.PI * 2);
    context.fill();
    const isPhone = device === "phone";
    const isBrowser = device === "browser";
    const frameWidth = isPhone ? 390 : isBrowser ? 1090 : 780;
    const frameHeight = isPhone ? 720 : isBrowser ? 650 : 620;
    const x = (width - frameWidth) / 2;
    const y = (height - frameHeight) / 2;
    roundedRect(context, x, y, frameWidth, frameHeight, isPhone ? 58 : 34);
    context.fillStyle = "#352A2D";
    context.fill();
    const inset = isPhone ? 20 : 16;
    roundedRect(context, x + inset, y + inset, frameWidth - inset * 2, frameHeight - inset * 2, isPhone ? 42 : 20);
    context.fillStyle = "#FFF8F1";
    context.fill();
    if (isPhone) {
      roundedRect(context, x + frameWidth / 2 - 54, y + 26, 108, 18, 9);
      context.fillStyle = "#352A2D";
      context.fill();
    } else if (isBrowser) {
      context.fillStyle = "#F6DDE2";
      context.fillRect(x + inset, y + inset, frameWidth - inset * 2, 56);
      [0, 1, 2].forEach((index) => { context.fillStyle = index === 0 ? accent : "#D7B4B9"; context.beginPath(); context.arc(x + 45 + index * 24, y + 44, 7, 0, Math.PI * 2); context.fill(); });
    }
    const screenX = x + inset + (isPhone ? 32 : 64);
    const screenY = y + inset + (isPhone ? 96 : 120);
    const screenWidth = frameWidth - inset * 2 - (isPhone ? 64 : 128);
    context.fillStyle = accent;
    roundedRect(context, screenX, screenY, screenWidth, 135, 20);
    context.fill();
    context.fillStyle = "#FFF8F1";
    context.font = '400 50px "Instrument Serif", serif';
    context.fillText(title.slice(0, 34), screenX + 28, screenY + 78);
    context.fillStyle = "#F6DDE2";
    roundedRect(context, screenX, screenY + 170, screenWidth * .58, 34, 12);
    context.fill();
    roundedRect(context, screenX, screenY + 225, screenWidth * .84, 34, 12);
    context.fill();
    roundedRect(context, screenX, screenY + 280, screenWidth * .68, 34, 12);
    context.fill();
    context.fillStyle = "#352A2D";
    context.font = '800 22px "DM Sans", sans-serif';
    context.textAlign = "center";
    context.fillText(`${device.toUpperCase()} MOCKUP`, width / 2, height - 72);
    context.textAlign = "left";
  }, [accent, device, title]);
  const { canvasRef, downloadPng, status } = useCanvasPng({ width: 1600, height: 1000, filename: "cherry-device-mockup.png", draw });
  return <div className="workspace"><section className="panel"><h2>Interface em contexto</h2><p className="panel-help">Escolha o enquadramento e exporte uma apresentação clara da sua interface.</p><div className="field"><label htmlFor="device-kind">Dispositivo</label><select id="device-kind" value={device} onChange={(event) => setDevice(event.target.value as typeof device)}><option value="phone">Celular</option><option value="tablet">Tablet</option><option value="browser">Navegador</option></select></div><div className="field"><label htmlFor="device-title">Título da interface</label><input id="device-title" maxLength={34} value={title} onChange={(event) => setTitle(event.target.value)} /></div><div className="field"><label htmlFor="device-accent">Cor principal</label><input id="device-accent" type="color" value={accent} onChange={(event) => setAccent(event.target.value.toUpperCase())} /></div></section><CanvasPreview canvasRef={canvasRef} label="Prévia de mockup de dispositivo" status={status} onDownload={downloadPng} /></div>;
}

export function WebLabStudio({ tool }: Props) {
  if (tool.kind === "layout-grid") return <LayoutGridStudio />;
  if (tool.kind === "button-studio") return <ButtonStudio />;
  if (tool.kind === "glass-surface") return <GlassSurfaceStudio />;
  if (tool.kind === "mesh-gradient") return <MeshGradientStudio />;
  if (tool.kind === "hero-composer") return <HeroComposerStudio />;
  return <DeviceMockupStudio />;
}
