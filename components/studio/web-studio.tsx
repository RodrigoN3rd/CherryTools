"use client";

import { useMemo, useState } from "react";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools/catalog";
import { borderRadiusCss, boxShadowCss, makeSvgShape, patternCss, type ShadowLayer } from "@/lib/tools/algorithms";
import { CopyAction, DownloadAction } from "./design-actions";

type WebToolKind = Extract<ToolDefinition["kind"], "box-shadow" | "radius" | "svg" | "pattern">;
type Props = { tool: ToolDefinition & { kind: WebToolKind } };

function Range({ id, label, value, min, max, step = 1, suffix = "", onChange }: { id: string; label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (value: number) => void }) {
  return <div className="range-field"><label htmlFor={id}>{label}</label><output>{value}{suffix}</output><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></div>;
}

const defaultLayer: ShadowLayer = { x: 0, y: 14, blur: 28, spread: -10, color: "#622E3B", opacity: 0.2, inset: false };

function BoxShadowStudio() {
  const [layers, setLayers] = useState<ShadowLayer[]>([defaultLayer]);
  const update = (index: number, patch: Partial<ShadowLayer>) => setLayers((current) => current.map((layer, layerIndex) => layerIndex === index ? { ...layer, ...patch } : layer));
  const shadow = boxShadowCss(layers);
  const css = `box-shadow: ${shadow};`;
  return <div className="workspace">
    <section className="panel"><h2>Camadas de sombra</h2><p className="panel-help">Empilhe até três planos para ganhar profundidade sem pesar.</p>{layers.map((layer, index) => <fieldset className="shadow-layer" key={index}><legend>Camada {index + 1}</legend><div className="input-row"><Range id={`box-x-${index}`} label="Horizontal" value={layer.x} min={-30} max={30} suffix="px" onChange={(value) => update(index, { x: value })} /><Range id={`box-y-${index}`} label="Vertical" value={layer.y} min={-30} max={40} suffix="px" onChange={(value) => update(index, { y: value })} /></div><div className="input-row"><Range id={`box-blur-${index}`} label="Desfoque" value={layer.blur} min={0} max={80} suffix="px" onChange={(value) => update(index, { blur: value })} /><Range id={`box-spread-${index}`} label="Expansão" value={layer.spread} min={-30} max={30} suffix="px" onChange={(value) => update(index, { spread: value })} /></div><div className="input-row"><div className="field"><label htmlFor={`box-color-${index}`}>Cor</label><input id={`box-color-${index}`} type="color" value={layer.color} onChange={(event) => update(index, { color: event.target.value.toUpperCase() })} /></div><Range id={`box-opacity-${index}`} label="Opacidade" value={layer.opacity} min={0} max={1} step={0.05} onChange={(value) => update(index, { opacity: value })} /></div><label className="check-field"><input type="checkbox" checked={layer.inset} onChange={(event) => update(index, { inset: event.target.checked })} /> Sombra interna</label>{layers.length > 1 && <button className="button button-quiet button-small" type="button" onClick={() => setLayers((current) => current.filter((_, layerIndex) => layerIndex !== index))}><Trash2 size={14} /> Remover</button>}</fieldset>)}<div className="control-actions"><button className="button button-quiet button-small" type="button" disabled={layers.length === 3} onClick={() => setLayers((current) => [...current, { ...defaultLayer, x: 0, y: 3, blur: 8, spread: 0, opacity: 0.1 }])}><Plus size={14} /> Nova camada</button></div></section>
    <section className="panel preview-panel"><div className="web-sample web-sample--shadow" style={{ boxShadow: shadow }}>Elevação tranquila</div></section>
    <section className="panel"><h2>CSS em camadas</h2><p className="panel-help">Adicione outra camada para um contato mais natural com o fundo.</p><pre className="code-block">{css}</pre><div className="control-actions"><CopyAction value={css} /><DownloadAction filename="cherry-box-shadow.css" value={css} /></div></section>
  </div>;
}

function RadiusStudio() {
  const [corners, setCorners] = useState([32, 14, 38, 20]);
  const css = `border-radius: ${borderRadiusCss(corners)};`;
  const randomise = () => setCorners(Array.from({ length: 4 }, () => Math.floor(8 + Math.random() * 73)));
  return <div className="workspace">
    <section className="panel"><h2>Quatro cantos</h2><p className="panel-help">Valores diferentes criam uma forma própria sem perder a delicadeza.</p>{["Superior esquerdo", "Superior direito", "Inferior direito", "Inferior esquerdo"].map((label, index) => <Range id={`radius-${index}`} key={label} label={label} value={corners[index]} min={0} max={96} suffix="px" onChange={(value) => setCorners((current) => current.map((corner, cornerIndex) => cornerIndex === index ? value : corner))} />)}<div className="control-actions"><button className="button button-quiet button-small" type="button" onClick={randomise}><RefreshCw size={14} /> Forma orgânica</button></div></section>
    <section className="panel preview-panel"><div className="web-sample web-sample--radius" style={{ borderRadius: borderRadiusCss(corners) }}>Uma borda<br />com gesto.</div></section>
    <section className="panel"><h2>CSS da forma</h2><p className="panel-help">Você pode aplicar esta mesma assinatura a cards, imagens ou botões.</p><pre className="code-block">{css}</pre><div className="control-actions"><CopyAction value={css} /><DownloadAction filename="cherry-border-radius.css" value={css} /></div></section>
  </div>;
}

function SvgStudio() {
  const [kind, setKind] = useState<"wave" | "blob" | "circle" | "polygon">("blob");
  const [intensity, setIntensity] = useState(45);
  const [sides, setSides] = useState(6);
  const [color, setColor] = useState("#B83B4B");
  const svg = useMemo(() => makeSvgShape(kind, intensity, sides), [kind, intensity, sides]);
  const exportSvg = svg.replace("currentColor", color);
  return <div className="workspace">
    <section className="panel"><h2>Silhueta editável</h2><p className="panel-help">O SVG é gerado localmente e continua editável depois do download.</p><div className="field"><label htmlFor="svg-kind">Forma</label><select id="svg-kind" value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}><option value="wave">Onda</option><option value="blob">Blob</option><option value="circle">Círculo</option><option value="polygon">Polígono</option></select></div><Range id="svg-intensity" label="Intensidade" value={intensity} min={0} max={100} suffix="%" onChange={setIntensity} />{kind === "polygon" && <Range id="svg-sides" label="Lados" value={sides} min={3} max={12} onChange={setSides} />}<div className="field"><label htmlFor="svg-color">Cor</label><input id="svg-color" type="color" value={color} onChange={(event) => setColor(event.target.value.toUpperCase())} /></div></section>
    <section className="panel preview-panel"><div className="svg-preview" aria-label={`Prévia da forma ${kind}`} style={{ color }} dangerouslySetInnerHTML={{ __html: svg }} /></section>
    <section className="panel"><h2>SVG pronto</h2><p className="panel-help">Cole em qualquer editor vetorial ou use diretamente no seu projeto.</p><pre className="code-block">{exportSvg}</pre><div className="control-actions"><CopyAction value={exportSvg} label="Copiar SVG" /><DownloadAction filename="cherry-shape.svg" value={exportSvg} label="Baixar SVG" /></div></section>
  </div>;
}

function PatternStudio() {
  const [kind, setKind] = useState<"dots" | "lines" | "grid" | "checks">("grid");
  const [color, setColor] = useState("#B83B4B");
  const [size, setSize] = useState(24);
  const pattern = patternCss(kind, color, size);
  const css = `background: ${pattern};`;
  return <div className="workspace">
    <section className="panel"><h2>Textura repetível</h2><p className="panel-help">Padrões em CSS permanecem leves, nítidos e fáceis de redimensionar.</p><div className="field"><label htmlFor="pattern-kind">Traço</label><select id="pattern-kind" value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}><option value="dots">Pontos</option><option value="lines">Linhas</option><option value="grid">Grade</option><option value="checks">Xadrez</option></select></div><div className="field"><label htmlFor="pattern-color">Cor</label><input id="pattern-color" type="color" value={color} onChange={(event) => setColor(event.target.value.toUpperCase())} /></div><Range id="pattern-size" label="Escala" value={size} min={4} max={80} suffix="px" onChange={setSize} /></section>
    <section className="panel preview-panel"><div className="pattern-preview" style={{ background: pattern }}><span>Textura local</span></div></section>
    <section className="panel"><h2>CSS do padrão</h2><p className="panel-help">A mesma declaração se adapta ao espaço disponível sem precisar de uma imagem.</p><pre className="code-block">{css}</pre><div className="control-actions"><CopyAction value={css} /><DownloadAction filename="cherry-pattern.css" value={css} /></div></section>
  </div>;
}

export function WebStudio({ tool }: Props) {
  if (tool.kind === "box-shadow") return <BoxShadowStudio />;
  if (tool.kind === "radius") return <RadiusStudio />;
  if (tool.kind === "svg") return <SvgStudio />;
  return <PatternStudio />;
}
