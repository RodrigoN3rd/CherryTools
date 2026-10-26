"use client";
/* eslint-disable @next/next/no-img-element -- local object URLs are generated in the browser and cannot use Next's image optimizer. */

import { ChangeEvent, useMemo, useState } from "react";
import { Download, ImageUp } from "lucide-react";
import { socialCanvasDimensions, type SocialCanvasFormat } from "@/lib/tools/algorithms";
import { canvasBlob, downloadBlob, fileToImage } from "./browser-utils";

type PickedImage = { file: File; url: string };

function drawCover(context: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function drawLines(context: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, lineHeight: number, limit: number) {
  const words = text.split(" ");
  let line = "";
  let count = 0;
  for (const word of words) {
    const next = `${line}${word} `;
    if (context.measureText(next).width > width && line) { context.fillText(line, x, y + count * lineHeight); line = `${word} `; count += 1; if (count === limit) return; } else line = next;
  }
  if (count < limit && line) context.fillText(line, x, y + count * lineHeight);
}

export function SocialStudio() {
  const [format, setFormat] = useState<SocialCanvasFormat>("square");
  const [title, setTitle] = useState("Uma ideia pede espaço para florescer.");
  const [subtitle, setSubtitle] = useState("Use cor, texto e imagem para marcar a sua presença.");
  const [background, setBackground] = useState("#F6DDE2");
  const [foreground, setForeground] = useState("#622E3B");
  const [accent, setAccent] = useState("#B83B4B");
  const [image, setImage] = useState<PickedImage>();
  const [status, setStatus] = useState("Monte a composição e exporte um PNG no formato escolhido.");
  const dimensions = useMemo(() => socialCanvasDimensions(format), [format]);
  const chooseImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (image) URL.revokeObjectURL(image.url);
    setImage({ file, url: URL.createObjectURL(file) });
  };
  const exportCanvas = async () => {
    try {
      setStatus("Renderizando seu PNG localmente…");
      const canvas = document.createElement("canvas");
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("O canvas não está disponível.");
      context.fillStyle = background;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.globalAlpha = .2;
      context.fillStyle = accent;
      context.beginPath();
      context.arc(canvas.width * .82, canvas.height * .19, Math.min(canvas.width, canvas.height) * .2, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1;
      if (image) {
        const source = await fileToImage(image.file);
        const x = canvas.width * .1;
        const y = canvas.height * .51;
        const width = canvas.width * .8;
        const height = canvas.height * .36;
        context.save();
        context.beginPath();
        context.roundRect(x, y, width, height, Math.min(canvas.width, canvas.height) * .025);
        context.clip();
        drawCover(context, source, x, y, width, height);
        context.restore();
      }
      const padding = canvas.width * .1;
      context.fillStyle = foreground;
      context.font = `italic ${Math.round(canvas.width * .07)}px Georgia, serif`;
      drawLines(context, title, padding, canvas.height * .2, canvas.width - padding * 2, Math.round(canvas.width * .078), 4);
      context.fillStyle = foreground;
      context.globalAlpha = .76;
      context.font = `${Math.round(canvas.width * .025)}px system-ui, sans-serif`;
      drawLines(context, subtitle, padding, canvas.height * .43, canvas.width - padding * 2, Math.round(canvas.width * .032), 3);
      context.globalAlpha = 1;
      const blob = await canvasBlob(canvas);
      downloadBlob(`cherry-social-${format}.png`, blob);
      setStatus(`${dimensions.label} exportado em PNG.`);
    } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível exportar esta arte."); }
  };
  return <div className="workspace">
    <section className="panel"><h2>Composição social</h2><p className="panel-help">Uma arte leve para publicar, sem depender de um editor externo.</p><div className="field"><label htmlFor="social-format">Formato</label><select id="social-format" value={format} onChange={(event) => setFormat(event.target.value as SocialCanvasFormat)}><option value="square">Instagram quadrado · 1080 × 1080</option><option value="portrait">Instagram retrato · 1080 × 1350</option><option value="story">Story · 1080 × 1920</option><option value="landscape">Capa horizontal · 1200 × 628</option></select></div><div className="field"><label htmlFor="social-title">Título</label><textarea id="social-title" value={title} onChange={(event) => setTitle(event.target.value)} /></div><div className="field"><label htmlFor="social-subtitle">Texto de apoio</label><textarea id="social-subtitle" value={subtitle} onChange={(event) => setSubtitle(event.target.value)} /></div><div className="input-row"><div className="field"><label htmlFor="social-background">Fundo</label><input id="social-background" type="color" value={background} onChange={(event) => setBackground(event.target.value.toUpperCase())} /></div><div className="field"><label htmlFor="social-accent">Forma</label><input id="social-accent" type="color" value={accent} onChange={(event) => setAccent(event.target.value.toUpperCase())} /></div></div><div className="field"><label htmlFor="social-image">Imagem opcional</label><input id="social-image" type="file" accept="image/*" onChange={chooseImage} /></div><button className="button button-primary" type="button" onClick={exportCanvas}><Download size={15} /> Exportar PNG</button><p className="status" role="status">{status}</p></section>
    <section className="panel preview-panel"><div className="social-preview" style={{ aspectRatio: `${dimensions.width} / ${dimensions.height}`, color: foreground, background }}><i style={{ background: accent }} /><span>{dimensions.label}</span><h2>{title}</h2><p>{subtitle}</p>{image ? <img src={image.url} alt="Prévia da imagem escolhida" /> : <div className="social-image-empty"><ImageUp size={22} /> Sua imagem opcional</div>}</div></section>
    <section className="panel"><h2>Pronto para publicar</h2><p className="panel-help">O arquivo será criado no tamanho do formato escolhido.</p><div className="social-spec"><strong>{dimensions.label}</strong><span>{format === "story" ? "vertical" : format === "landscape" ? "horizontal" : "feed"}</span></div></section>
  </div>;
}
