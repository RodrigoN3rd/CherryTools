"use client";

import { useCallback, useState } from "react";
import { Download } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools/catalog";
import { useCanvasPng, type CanvasDraw } from "./canvas-export";

type StaticTypeKind = Extract<ToolDefinition["kind"], "google-font-explorer" | "variable-font-axis" | "typographic-poster" | "text-outline" | "monogram" | "text-path" | "quote-card">;
type Props = { tool: ToolDefinition & { kind: StaticTypeKind } };

const fontOptions = [
  { name: "Bricolage Grotesque", family: '"Bricolage Grotesque", sans-serif' },
  { name: "Fraunces", family: '"Fraunces", serif' },
  { name: "Cormorant Garamond", family: '"Cormorant Garamond", serif' },
  { name: "DM Sans", family: '"DM Sans", sans-serif' },
  { name: "Space Mono", family: '"Space Mono", monospace' }
];

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

function CanvasPreview({ canvasRef, label, status, onDownload }: { canvasRef: React.RefObject<HTMLCanvasElement | null>; label: string; status: string; onDownload: () => void }) {
  return <section className="panel preview-panel canvas-preview-panel"><canvas ref={canvasRef} width={1600} height={1000} className="design-canvas" role="img" aria-label={label}>A prévia será renderizada aqui.</canvas><div className="canvas-preview-actions"><button className="button button-primary button-small" type="button" onClick={onDownload}><Download size={14} /> Baixar PNG</button>{status && <p className="status" role="status">{status}</p>}</div></section>;
}

function GoogleFontExplorer() {
  const [fontIndex, setFontIndex] = useState(0);
  const [size, setSize] = useState(128);
  const [weight, setWeight] = useState(650);
  const [sample, setSample] = useState("A ideia ganha voz.");
  const font = fontOptions[fontIndex];
  const draw = useCallback<CanvasDraw>((context, width, height) => {
    context.fillStyle = "#FFF8F1";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#F6DDE2";
    context.beginPath();
    context.arc(width * .81, height * .2, width * .2, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#B83B4B";
    context.font = '800 27px "DM Sans", sans-serif';
    context.letterSpacing = "4px";
    context.fillText("GOOGLE FONTS / ESTUDO", 105, 110);
    context.letterSpacing = "0px";
    context.fillStyle = "#352A2D";
    context.font = `${weight} ${size}px ${font.family}`;
    const lines = wrapText(context, sample, width - 210);
    const lineHeight = size * .95;
    const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => context.fillText(line, 105, startY + index * lineHeight));
    context.strokeStyle = "#E9A3AD";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(105, height - 126);
    context.lineTo(width - 105, height - 126);
    context.stroke();
    context.fillStyle = "#746468";
    context.font = '600 25px "DM Sans", sans-serif';
    context.fillText(`${font.name} · peso ${weight}`, 105, height - 76);
  }, [font, sample, size, weight]);
  const { canvasRef, downloadPng, status } = useCanvasPng({ width: 1600, height: 1000, filename: "cherry-google-font.png", draw });
  return <div className="workspace">
    <section className="panel"><h2>Família e voz</h2><p className="panel-help">As famílias vêm da CSS API do Google Fonts e ficam disponíveis para a prévia e o PNG.</p><div className="field"><label htmlFor="google-font-family">Família</label><select id="google-font-family" value={fontIndex} onChange={(event) => setFontIndex(Number(event.target.value))}>{fontOptions.map((option, index) => <option key={option.name} value={index}>{option.name}</option>)}</select></div><div className="field"><label htmlFor="google-font-sample">Texto</label><textarea id="google-font-sample" maxLength={70} value={sample} onChange={(event) => setSample(event.target.value)} /></div><Range id="google-font-size" label="Tamanho" value={size} min={60} max={190} suffix="px" onChange={setSize} /><Range id="google-font-weight" label="Peso" value={weight} min={200} max={900} step={50} onChange={setWeight} /></section>
    <CanvasPreview canvasRef={canvasRef} label="Prévia da família Google Fonts selecionada" status={status} onDownload={downloadPng} />
  </div>;
}

function VariableAxisStudio() {
  const [weight, setWeight] = useState(560);
  const [widthAxis, setWidthAxis] = useState(92);
  const [size, setSize] = useState(164);
  const [sample, setSample] = useState("Flexível");
  const draw = useCallback<CanvasDraw>((context, width, height) => {
    context.fillStyle = "#622E3B";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#F6DDE2";
    context.fillRect(92, 92, width - 184, height - 184);
    context.fillStyle = "#B83B4B";
    context.font = '800 26px "DM Sans", sans-serif';
    context.fillText("EIXOS VARIÁVEIS", 142, 162);
    context.save();
    context.translate(width / 2, height / 2 + 55);
    context.scale(widthAxis / 100, 1);
    context.fillStyle = "#352A2D";
    context.textAlign = "center";
    context.font = `${weight} ${size}px "Bricolage Grotesque", sans-serif`;
    context.fillText(sample || " ", 0, 0);
    context.restore();
    context.fillStyle = "#746468";
    context.font = '600 24px "DM Sans", sans-serif';
    context.fillText(`wght ${weight}   ·   wdth ${widthAxis}%   ·   opsz ${size}`, 142, height - 142);
  }, [sample, size, weight, widthAxis]);
  const { canvasRef, downloadPng, status } = useCanvasPng({ width: 1600, height: 1000, filename: "cherry-variable-font.png", draw });
  return <div className="workspace">
    <section className="panel"><h2>Laboratório variável</h2><p className="panel-help">Use peso, largura e tamanho óptico como uma única decisão de voz.</p><div className="field"><label htmlFor="variable-font-sample">Palavra</label><input id="variable-font-sample" maxLength={24} value={sample} onChange={(event) => setSample(event.target.value)} /></div><Range id="variable-font-weight" label="Peso (wght)" value={weight} min={200} max={900} step={10} onChange={setWeight} /><Range id="variable-font-width" label="Largura (wdth)" value={widthAxis} min={75} max={100} onChange={setWidthAxis} /><Range id="variable-font-size" label="Tamanho óptico" value={size} min={72} max={210} suffix="px" onChange={setSize} /></section>
    <CanvasPreview canvasRef={canvasRef} label="Prévia dos eixos de fonte variável" status={status} onDownload={downloadPng} />
  </div>;
}

function TypographicPoster() {
  const [headline, setHeadline] = useState("FAÇA\nESPAÇO");
  const [background, setBackground] = useState("#B83B4B");
  const [ink, setInk] = useState("#FFF8F1");
  const [alignment, setAlignment] = useState<"left" | "center">("left");
  const draw = useCallback<CanvasDraw>((context, width, height) => {
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "rgb(255 248 241 / .35)";
    context.lineWidth = 2;
    context.strokeRect(62, 62, width - 124, height - 124);
    context.fillStyle = ink;
    context.font = '800 25px "DM Sans", sans-serif';
    context.letterSpacing = "5px";
    context.textAlign = alignment;
    const x = alignment === "left" ? 125 : width / 2;
    context.fillText("CHERRY TYPE / 01", x, 135);
    context.letterSpacing = "0px";
    context.font = '400 220px "Instrument Serif", serif';
    headline.split("\n").slice(0, 3).forEach((line, index) => context.fillText(line || " ", x, 490 + index * 190));
    context.font = '600 26px "DM Sans", sans-serif';
    context.fillText("Uma composição feita no navegador.", x, height - 125);
  }, [alignment, background, headline, ink]);
  const { canvasRef, downloadPng, status } = useCanvasPng({ width: 1200, height: 1600, filename: "cherry-typographic-poster.png", draw });
  return <div className="workspace">
    <section className="panel"><h2>Palavra em cena</h2><p className="panel-help">Quebre as linhas para dar ritmo e deixe uma única cor sustentar a peça.</p><div className="field"><label htmlFor="poster-headline">Título</label><textarea id="poster-headline" maxLength={32} value={headline} onChange={(event) => setHeadline(event.target.value.toUpperCase())} /></div><div className="input-row"><div className="field"><label htmlFor="poster-background">Fundo</label><input id="poster-background" type="color" value={background} onChange={(event) => setBackground(event.target.value.toUpperCase())} /></div><div className="field"><label htmlFor="poster-ink">Texto</label><input id="poster-ink" type="color" value={ink} onChange={(event) => setInk(event.target.value.toUpperCase())} /></div></div><div className="field"><label htmlFor="poster-alignment">Alinhamento</label><select id="poster-alignment" value={alignment} onChange={(event) => setAlignment(event.target.value as typeof alignment)}><option value="left">À esquerda</option><option value="center">Centralizado</option></select></div></section>
    <CanvasPreview canvasRef={canvasRef} label="Prévia de pôster tipográfico" status={status} onDownload={downloadPng} />
  </div>;
}

function TextOutlineStudio() {
  const [text, setText] = useState("RITMO");
  const [fill, setFill] = useState("#FFF8F1");
  const [stroke, setStroke] = useState("#B83B4B");
  const [thickness, setThickness] = useState(10);
  const draw = useCallback<CanvasDraw>((context, width, height) => {
    context.fillStyle = "#F6DDE2";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#E9A3AD";
    context.beginPath();
    context.arc(width * .17, height * .16, width * .2, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#622E3B";
    context.font = '800 25px "DM Sans", sans-serif';
    context.fillText("CONTORNO / PREENCHIMENTO", 90, 120);
    let size = 260;
    context.font = `800 ${size}px "DM Sans", sans-serif`;
    while (context.measureText(text || " ").width > width - 160 && size > 64) {
      size -= 4;
      context.font = `800 ${size}px "DM Sans", sans-serif`;
    }
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineJoin = "round";
    context.lineWidth = thickness;
    context.strokeStyle = stroke;
    context.fillStyle = fill;
    context.strokeText(text || " ", width / 2, height / 2 + 35);
    context.fillText(text || " ", width / 2, height / 2 + 35);
  }, [fill, stroke, text, thickness]);
  const { canvasRef, downloadPng, status } = useCanvasPng({ width: 1600, height: 1000, filename: "cherry-text-outline.png", draw });
  return <div className="workspace">
    <section className="panel"><h2>Linha que segura a forma</h2><p className="panel-help">O mesmo texto pode pesar, flutuar ou recuar quando a borda muda.</p><div className="field"><label htmlFor="outline-text">Palavra</label><input id="outline-text" maxLength={24} value={text} onChange={(event) => setText(event.target.value.toUpperCase())} /></div><div className="input-row"><div className="field"><label htmlFor="outline-fill">Preenchimento</label><input id="outline-fill" type="color" value={fill} onChange={(event) => setFill(event.target.value.toUpperCase())} /></div><div className="field"><label htmlFor="outline-stroke">Contorno</label><input id="outline-stroke" type="color" value={stroke} onChange={(event) => setStroke(event.target.value.toUpperCase())} /></div></div><Range id="outline-thickness" label="Espessura" value={thickness} min={1} max={34} suffix="px" onChange={setThickness} /></section>
    <CanvasPreview canvasRef={canvasRef} label="Prévia de texto com contorno" status={status} onDownload={downloadPng} />
  </div>;
}

function MonogramStudio() {
  const [initials, setInitials] = useState("CT");
  const [shape, setShape] = useState<"circle" | "rounded">("circle");
  const [background, setBackground] = useState("#622E3B");
  const [ink, setInk] = useState("#F6DDE2");
  const draw = useCallback<CanvasDraw>((context, width, height) => {
    context.fillStyle = "#FFF8F1";
    context.fillRect(0, 0, width, height);
    const size = Math.min(width, height) * .64;
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    context.fillStyle = background;
    if (shape === "circle") {
      context.beginPath();
      context.arc(width / 2, height / 2, size / 2, 0, Math.PI * 2);
      context.fill();
    } else {
      roundedRect(context, x, y, size, size, size * .2);
      context.fill();
    }
    context.strokeStyle = "rgb(255 255 255 / .35)";
    context.lineWidth = 3;
    if (shape === "circle") {
      context.beginPath();
      context.arc(width / 2, height / 2, size / 2 - 38, 0, Math.PI * 2);
      context.stroke();
    } else {
      roundedRect(context, x + 38, y + 38, size - 76, size - 76, size * .14);
      context.stroke();
    }
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = ink;
    context.font = `400 ${size * .44}px "Instrument Serif", serif`;
    context.fillText((initials || " ").slice(0, 3).toUpperCase(), width / 2, height / 2 + 15);
    context.font = '800 24px "DM Sans", sans-serif';
    context.fillStyle = "#746468";
    context.fillText("MONOGRAMA / CHERRY TOOLS", width / 2, height - 78);
  }, [background, initials, ink, shape]);
  const { canvasRef, downloadPng, status } = useCanvasPng({ width: 1200, height: 1200, filename: "cherry-monogram.png", draw });
  return <div className="workspace">
    <section className="panel"><h2>Assinatura essencial</h2><p className="panel-help">Uma forma, duas ou três iniciais e contraste suficiente para sobreviver em tamanho pequeno.</p><div className="field"><label htmlFor="monogram-initials">Iniciais</label><input id="monogram-initials" maxLength={3} value={initials} onChange={(event) => setInitials(event.target.value.toUpperCase())} /></div><div className="field"><label htmlFor="monogram-shape">Forma</label><select id="monogram-shape" value={shape} onChange={(event) => setShape(event.target.value as typeof shape)}><option value="circle">Círculo</option><option value="rounded">Quadrado arredondado</option></select></div><div className="input-row"><div className="field"><label htmlFor="monogram-background">Base</label><input id="monogram-background" type="color" value={background} onChange={(event) => setBackground(event.target.value.toUpperCase())} /></div><div className="field"><label htmlFor="monogram-ink">Iniciais</label><input id="monogram-ink" type="color" value={ink} onChange={(event) => setInk(event.target.value.toUpperCase())} /></div></div></section>
    <CanvasPreview canvasRef={canvasRef} label="Prévia de monograma" status={status} onDownload={downloadPng} />
  </div>;
}

function TextPathStudio() {
  const [text, setText] = useState("DESENHE COM INTENÇÃO");
  const [curve, setCurve] = useState(210);
  const [radius, setRadius] = useState(280);
  const [color, setColor] = useState("#B83B4B");
  const draw = useCallback<CanvasDraw>((context, width, height) => {
    context.fillStyle = "#FFF8F1";
    context.fillRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2 + 110;
    context.strokeStyle = "#E9A3AD";
    context.lineWidth = 2;
    context.setLineDash([10, 14]);
    context.beginPath();
    context.arc(cx, cy, radius, Math.PI + (Math.PI - curve * Math.PI / 180) / 2, Math.PI * 2 - (Math.PI - curve * Math.PI / 180) / 2);
    context.stroke();
    context.setLineDash([]);
    const chars = Array.from(text || " ");
    const span = curve * Math.PI / 180;
    context.fillStyle = color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = '700 58px "DM Sans", sans-serif';
    chars.forEach((char, index) => {
      const angle = Math.PI * 1.5 - span / 2 + (span * (index + .5)) / chars.length;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      context.save();
      context.translate(x, y);
      context.rotate(angle + Math.PI / 2);
      context.fillText(char, 0, 0);
      context.restore();
    });
    context.fillStyle = "#622E3B";
    context.font = '400 152px "Instrument Serif", serif';
    context.fillText("giro", cx, cy + 74);
    context.font = '800 22px "DM Sans", sans-serif';
    context.fillStyle = "#746468";
    context.fillText("TEXTO EM CURVA", cx, 112);
  }, [color, curve, radius, text]);
  const { canvasRef, downloadPng, status } = useCanvasPng({ width: 1200, height: 1200, filename: "cherry-text-path.png", draw });
  return <div className="workspace">
    <section className="panel"><h2>Ritmo em arco</h2><p className="panel-help">A curva guia a leitura. Menos caracteres deixam mais ar entre as letras.</p><div className="field"><label htmlFor="text-path-copy">Texto</label><input id="text-path-copy" maxLength={30} value={text} onChange={(event) => setText(event.target.value.toUpperCase())} /></div><Range id="text-path-curve" label="Abertura" value={curve} min={90} max={330} suffix="°" onChange={setCurve} /><Range id="text-path-radius" label="Raio" value={radius} min={180} max={410} suffix="px" onChange={setRadius} /><div className="field"><label htmlFor="text-path-color">Cor</label><input id="text-path-color" type="color" value={color} onChange={(event) => setColor(event.target.value.toUpperCase())} /></div></section>
    <CanvasPreview canvasRef={canvasRef} label="Prévia de texto em curva" status={status} onDownload={downloadPng} />
  </div>;
}

function QuoteCardStudio() {
  const [quote, setQuote] = useState("Uma boa ideia encontra espaço para respirar.");
  const [author, setAuthor] = useState("Cherry Tools");
  const [background, setBackground] = useState("#F6DDE2");
  const [ink, setInk] = useState("#622E3B");
  const draw = useCallback<CanvasDraw>((context, width, height) => {
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    context.fillStyle = "rgb(255 255 255 / .46)";
    context.beginPath();
    context.arc(width * .87, height * .12, width * .23, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = ink;
    context.font = '400 230px "Instrument Serif", serif';
    context.fillText("“", 102, 292);
    context.font = '400 92px "Instrument Serif", serif';
    const lines = wrapText(context, quote, width - 220).slice(0, 5);
    lines.forEach((line, index) => context.fillText(line, 112, 402 + index * 112));
    context.fillStyle = "rgb(98 46 59 / .25)";
    context.fillRect(112, height - 214, width - 224, 2);
    context.fillStyle = ink;
    context.font = '800 28px "DM Sans", sans-serif';
    context.fillText(`— ${author || "Autor"}`, 112, height - 138);
    context.font = '700 20px "DM Sans", sans-serif';
    context.fillStyle = "#B83B4B";
    context.fillText("CARTÃO DE CITAÇÃO", 112, 110);
  }, [author, background, ink, quote]);
  const { canvasRef, downloadPng, status } = useCanvasPng({ width: 1200, height: 1200, filename: "cherry-quote-card.png", draw });
  return <div className="workspace">
    <section className="panel"><h2>Frase compartilhável</h2><p className="panel-help">Uma peça quadrada que deixa a frase ser a parte mais importante.</p><div className="field"><label htmlFor="quote-copy">Citação</label><textarea id="quote-copy" maxLength={150} value={quote} onChange={(event) => setQuote(event.target.value)} /></div><div className="field"><label htmlFor="quote-author">Autoria</label><input id="quote-author" maxLength={42} value={author} onChange={(event) => setAuthor(event.target.value)} /></div><div className="input-row"><div className="field"><label htmlFor="quote-background">Fundo</label><input id="quote-background" type="color" value={background} onChange={(event) => setBackground(event.target.value.toUpperCase())} /></div><div className="field"><label htmlFor="quote-ink">Texto</label><input id="quote-ink" type="color" value={ink} onChange={(event) => setInk(event.target.value.toUpperCase())} /></div></div></section>
    <CanvasPreview canvasRef={canvasRef} label="Prévia de cartão de citação" status={status} onDownload={downloadPng} />
  </div>;
}

export function TypeLabStudio({ tool }: Props) {
  if (tool.kind === "google-font-explorer") return <GoogleFontExplorer />;
  if (tool.kind === "variable-font-axis") return <VariableAxisStudio />;
  if (tool.kind === "typographic-poster") return <TypographicPoster />;
  if (tool.kind === "text-outline") return <TextOutlineStudio />;
  if (tool.kind === "monogram") return <MonogramStudio />;
  if (tool.kind === "text-path") return <TextPathStudio />;
  return <QuoteCardStudio />;
}
