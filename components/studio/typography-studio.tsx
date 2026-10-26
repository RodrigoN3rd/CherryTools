"use client";

import { useMemo, useState } from "react";
import type { ToolDefinition } from "@/lib/tools/catalog";
import { textShadowCss, typographyScale } from "@/lib/tools/algorithms";
import { CopyAction, DownloadAction, PngDownloadAction } from "./design-actions";

type TypeToolKind = Extract<ToolDefinition["kind"], "font-pairing" | "type-scale" | "text-shadow">;
type Props = { tool: ToolDefinition & { kind: TypeToolKind } };

const pairs = [
  { name: "Editorial suave", heading: 'Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif', body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  { name: "Estúdio moderno", heading: 'Avenir Next, Avenir, "Segoe UI", sans-serif', body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  { name: "Papel e tinta", heading: 'Georgia, "Times New Roman", serif', body: 'ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif' },
  { name: "Caderno técnico", heading: 'ui-monospace, SFMono-Regular, Menlo, monospace', body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }
];

function Range({ id, label, value, min, max, step = 1, suffix = "", onChange }: { id: string; label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (value: number) => void }) {
  return <div className="range-field"><label htmlFor={id}>{label}</label><output>{value}{suffix}</output><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></div>;
}

function FontPairingStudio() {
  const [index, setIndex] = useState(0);
  const pair = pairs[index];
  const css = `:root {\n  --font-heading: ${pair.heading};\n  --font-body: ${pair.body};\n}`;
  return <div className="workspace">
    <section className="panel"><h2>Pilhas disponíveis</h2><p className="panel-help">Combinações de fontes do dispositivo, sem uma dependência externa.</p><div className="field"><label htmlFor="font-pair">Combinação</label><select id="font-pair" value={index} onChange={(event) => setIndex(Number(event.target.value))}>{pairs.map((item, itemIndex) => <option value={itemIndex} key={item.name}>{item.name}</option>)}</select></div></section>
    <section className="panel preview-panel"><article className="type-pair-preview"><p style={{ fontFamily: pair.body }}>Calm Cherry / 2026</p><h2 style={{ fontFamily: pair.heading }}>Uma voz visual começa pelo ritmo.</h2><span style={{ fontFamily: pair.body }}>Leia o título, encontre a pausa e deixe o texto sustentar a ideia.</span></article></section>
    <section className="panel"><h2>CSS da dupla</h2><p className="panel-help">Use as variáveis para manter títulos e texto em sintonia.</p><pre className="code-block">{css}</pre><div className="control-actions"><CopyAction value={css} /><DownloadAction filename="cherry-font-pair.css" value={css} /><PngDownloadAction filename="cherry-font-pair.png" draw={(context, width, height) => { context.fillStyle = "#FFF8F1"; context.fillRect(0, 0, width, height); context.fillStyle = "#B83B4B"; context.font = `700 28px ${pair.body}`; context.fillText("CALM CHERRY / 2026", 100, 130); context.fillStyle = "#622E3B"; context.font = `400 132px ${pair.heading}`; context.fillText("Uma voz visual", 100, 380); context.fillText("começa pelo ritmo.", 100, 530); context.fillStyle = "#746468"; context.font = `400 34px ${pair.body}`; context.fillText("Leia o título, encontre a pausa e deixe o texto sustentar a ideia.", 100, 660); }} /></div></section>
  </div>;
}

function TypeScaleStudio() {
  const [base, setBase] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [steps, setSteps] = useState(6);
  const [lineHeight, setLineHeight] = useState(1.4);
  const scale = useMemo(() => typographyScale(base, ratio, steps, lineHeight), [base, ratio, steps, lineHeight]);
  const css = `:root {\n${scale.map((item) => `  ${item.token}: ${item.rem};`).join("\n")}\n}\n\n.type {\n  line-height: ${lineHeight};\n}`;
  return <div className="workspace">
    <section className="panel"><h2>Ritmo da escala</h2><p className="panel-help">Comece pelo corpo do texto e deixe a razão conduzir os destaques.</p><Range id="type-base" label="Base" value={base} min={12} max={24} suffix="px" onChange={setBase} /><Range id="type-ratio" label="Razão" value={ratio} min={1.1} max={1.6} step={0.05} onChange={setRatio} /><Range id="type-line-height" label="Entrelinha" value={lineHeight} min={1} max={2} step={0.05} onChange={setLineHeight} /><div className="field"><label htmlFor="type-steps">Níveis</label><select id="type-steps" value={steps} onChange={(event) => setSteps(Number(event.target.value))}>{[4, 5, 6, 7, 8].map((value) => <option value={value} key={value}>{value} níveis</option>)}</select></div></section>
    <section className="panel preview-panel"><div className="type-scale-preview">{scale.slice().reverse().map((item, index) => <p key={item.token} style={{ fontSize: `min(${item.rem}, ${index === 0 ? "3.6rem" : "2.8rem"})`, lineHeight: item.lineHeight }}><span>{item.token}</span> A criação encontra seu tom.</p>)}</div></section>
    <section className="panel"><h2>Tokens prontos</h2><p className="panel-help">Valores em rem, para a escala respeitar a preferência de fonte de quem usa seu site.</p><pre className="code-block">{css}</pre><div className="control-actions"><CopyAction value={css} /><DownloadAction filename="cherry-type-scale.css" value={css} /><PngDownloadAction filename="cherry-type-scale.png" draw={(context, width, height) => { context.fillStyle = "#FFF8F1"; context.fillRect(0, 0, width, height); context.fillStyle = "#B83B4B"; context.font = '800 26px "DM Sans", sans-serif'; context.fillText("ESCALA TIPOGRÁFICA", 94, 96); scale.slice().reverse().forEach((item, index) => { const size = Math.min(118, Math.max(28, item.px * 2.35)); const y = 200 + index * 120; context.fillStyle = "#B83B4B"; context.font = '800 20px "DM Sans", sans-serif'; context.fillText(item.token, 94, y); context.fillStyle = "#622E3B"; context.font = `400 ${size}px "Instrument Serif", serif`; context.fillText("A criação encontra seu tom.", 300, y); }); }} /></div></section>
  </div>;
}

function TextShadowStudio() {
  const [x, setX] = useState(2);
  const [y, setY] = useState(4);
  const [blur, setBlur] = useState(10);
  const [color, setColor] = useState("#622E3B");
  const [opacity, setOpacity] = useState(0.25);
  const shadow = textShadowCss({ x, y, blur, color, opacity });
  const css = `text-shadow: ${shadow};`;
  return <div className="workspace">
    <section className="panel"><h2>Profundidade da letra</h2><p className="panel-help">Uma sombra discreta deve ajudar a leitura, não competir com ela.</p><Range id="text-shadow-x" label="Horizontal" value={x} min={-20} max={20} suffix="px" onChange={setX} /><Range id="text-shadow-y" label="Vertical" value={y} min={-20} max={20} suffix="px" onChange={setY} /><Range id="text-shadow-blur" label="Desfoque" value={blur} min={0} max={40} suffix="px" onChange={setBlur} /><div className="field"><label htmlFor="text-shadow-color">Cor</label><input id="text-shadow-color" type="color" value={color} onChange={(event) => setColor(event.target.value.toUpperCase())} /></div><Range id="text-shadow-opacity" label="Opacidade" value={opacity} min={0} max={1} step={0.05} onChange={setOpacity} /></section>
    <section className="panel preview-panel"><p className="shadow-type-preview" style={{ textShadow: shadow }}>Delicadamente<br />em relevo.</p></section>
    <section className="panel"><h2>Declaração CSS</h2><p className="panel-help">A prévia usa exatamente o valor abaixo.</p><pre className="code-block">{css}</pre><div className="control-actions"><CopyAction value={css} /><DownloadAction filename="cherry-text-shadow.css" value={css} /><PngDownloadAction filename="cherry-text-shadow.png" draw={(context, width, height) => { context.fillStyle = "#FFF8F1"; context.fillRect(0, 0, width, height); context.fillStyle = "#B83B4B"; context.font = '800 26px "DM Sans", sans-serif'; context.fillText("SOMBRA DE TEXTO", 94, 102); context.shadowColor = `${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")}`; context.shadowBlur = blur; context.shadowOffsetX = x; context.shadowOffsetY = y; context.fillStyle = color; context.font = 'italic 190px "Instrument Serif", serif'; context.fillText("Delicadamente", 100, 430); context.fillText("em relevo.", 100, 620); context.shadowColor = "transparent"; }} /></div></section>
  </div>;
}

export function TypographyStudio({ tool }: Props) {
  if (tool.kind === "font-pairing") return <FontPairingStudio />;
  if (tool.kind === "type-scale") return <TypeScaleStudio />;
  return <TextShadowStudio />;
}
