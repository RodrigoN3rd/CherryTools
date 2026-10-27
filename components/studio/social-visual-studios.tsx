"use client";
/* eslint-disable @next/next/no-img-element -- previews are private, local object URLs. */

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { Download, GripVertical, ImageUp, Layers, Plus, Trash2 } from "lucide-react";
import { canvasBlob } from "./browser-utils";
import { drawContain, drawCover, drawLines, exportCanvas, exportPngZip, imageFor, makeId, type LocalImage } from "./social-utils";
import { safeZonePresets, socialFormatList, socialFormats, type SocialFormatId } from "@/lib/social/presets";

type VisualStatus = { message: string; error?: boolean };

function pickImages(event: ChangeEvent<HTMLInputElement>, multiple = false): LocalImage[] {
  const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"));
  return (multiple ? files : files.slice(0, 1)).map((file) => ({ id: makeId(), name: file.name, file, url: URL.createObjectURL(file) }));
}

type CarouselSlide = { id: string; title: string; caption: string; background: string; foreground: string; accent: string; image?: LocalImage };

const createSlide = (offset = 0): CarouselSlide => ({
  id: makeId(),
  title: ["Dê espaço à ideia", "Traga uma decisão", "Termine com um gesto"][offset % 3],
  caption: "Uma sequência pensada para ser lida com calma.",
  background: ["#F6DDE2", "#FFF8F1", "#622E3B"][offset % 3],
  foreground: offset % 3 === 2 ? "#FFF8F1" : "#622E3B",
  accent: ["#B83B4B", "#D77988", "#E9A3AD"][offset % 3]
});

function createSlideCanvas(slide: CarouselSlide, format: SocialFormatId) {
  const size = socialFormats[format];
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Seu navegador não conseguiu preparar o slide.");
  return { canvas, context, size };
}

async function renderCarouselSlide(slide: CarouselSlide, format: SocialFormatId): Promise<Blob> {
  const { canvas, context, size } = createSlideCanvas(slide, format);
  context.fillStyle = slide.background;
  context.fillRect(0, 0, size.width, size.height);
  context.fillStyle = slide.accent;
  context.globalAlpha = .18;
  context.beginPath();
  context.arc(size.width * .82, size.height * .2, Math.min(size.width, size.height) * .27, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
  const picture = await imageFor(slide.image);
  if (picture) {
    const x = size.width * .1;
    const y = size.height * .54;
    const width = size.width * .8;
    const height = size.height * .31;
    context.save();
    context.beginPath();
    context.roundRect(x, y, width, height, size.width * .025);
    context.clip();
    drawCover(context, picture, picture.naturalWidth, picture.naturalHeight, x, y, width, height);
    context.restore();
  }
  context.fillStyle = slide.foreground;
  context.font = `italic 700 ${Math.round(size.width * .085)}px Georgia, serif`;
  drawLines(context, slide.title, size.width * .1, size.height * .21, size.width * .78, Math.round(size.width * .09), 4);
  context.globalAlpha = .78;
  context.font = `600 ${Math.round(size.width * .028)}px system-ui, sans-serif`;
  drawLines(context, slide.caption, size.width * .1, size.height * .43, size.width * .74, Math.round(size.width * .037), 3);
  context.globalAlpha = 1;
  context.fillStyle = slide.accent;
  context.fillRect(size.width * .1, size.height * .13, size.width * .18, size.width * .009);
  return canvasBlob(canvas);
}

export function CarouselMakerStudio() {
  const [slides, setSlides] = useState<CarouselSlide[]>([createSlide(0), createSlide(1), createSlide(2)]);
  const [activeId, setActiveId] = useState(slides[0].id);
  const [format, setFormat] = useState<SocialFormatId>("instagramPortrait");
  const [status, setStatus] = useState<VisualStatus>({ message: "Crie a sequência e exporte quando estiver pronta." });
  const active = slides.find((slide) => slide.id === activeId) ?? slides[0];
  const size = socialFormats[format];
  const update = (changes: Partial<CarouselSlide>) => setSlides((current) => current.map((slide) => slide.id === active.id ? { ...slide, ...changes } : slide));
  const add = () => {
    const slide = createSlide(slides.length);
    setSlides((current) => [...current, slide]);
    setActiveId(slide.id);
  };
  const duplicate = () => {
    const slide = { ...active, id: makeId(), title: `${active.title} (cópia)` };
    setSlides((current) => {
      const index = current.findIndex((item) => item.id === active.id);
      return [...current.slice(0, index + 1), slide, ...current.slice(index + 1)];
    });
    setActiveId(slide.id);
  };
  const remove = () => {
    if (slides.length < 2) return setStatus({ message: "O carrossel precisa manter ao menos um slide.", error: true });
    const remaining = slides.filter((slide) => slide.id !== active.id);
    setSlides(remaining);
    setActiveId(remaining[0].id);
  };
  const move = (direction: -1 | 1) => {
    setSlides((current) => {
      const index = current.findIndex((slide) => slide.id === active.id);
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };
  const selectImage = (event: ChangeEvent<HTMLInputElement>) => update({ image: pickImages(event)[0] });
  const downloadOne = async () => {
    try {
      const { downloadBlob } = await import("./browser-utils");
      downloadBlob(`cherry-carousel-${slides.findIndex((slide) => slide.id === active.id) + 1}.png`, await renderCarouselSlide(active, format));
      setStatus({ message: "Slide em PNG pronto para baixar." });
    } catch (error) { setStatus({ message: error instanceof Error ? error.message : "Não foi possível criar o PNG.", error: true }); }
  };
  const downloadAll = async () => {
    try {
      setStatus({ message: "Preparando o ZIP localmente…" });
      await exportPngZip("cherry-carousel.zip", slides.map((slide, index) => ({ name: `slide-${String(index + 1).padStart(2, "0")}.png`, render: () => renderCarouselSlide(slide, format) })));
      setStatus({ message: "ZIP com todos os slides pronto para baixar." });
    } catch (error) { setStatus({ message: error instanceof Error ? error.message : "Não foi possível criar o ZIP.", error: true }); }
  };
  return <div className="social-workspace social-workspace--editor">
    <section className="panel social-controls"><h2>Slides</h2><p className="panel-help">Cada slide é uma peça independente e baixável.</p>
      <div className="slide-list">{slides.map((slide, index) => <button type="button" className={`slide-thumb ${slide.id === active.id ? "is-active" : ""}`} onClick={() => setActiveId(slide.id)} key={slide.id}><span style={{ background: slide.background, color: slide.foreground }}>{index + 1}</span><small>{slide.title}</small></button>)}</div>
      <div className="compact-actions"><button type="button" className="button button-quiet button-small" onClick={add}><Plus size={14} /> Novo</button><button type="button" className="button button-quiet button-small" onClick={duplicate}>Duplicar</button><button type="button" className="button button-quiet button-small" onClick={() => move(-1)}>↑</button><button type="button" className="button button-quiet button-small" onClick={() => move(1)}>↓</button><button type="button" className="button button-quiet button-small" onClick={remove}><Trash2 size={14} /> Remover</button></div>
      <div className="field"><label htmlFor="carousel-format">Formato</label><select id="carousel-format" value={format} onChange={(event) => setFormat(event.target.value as SocialFormatId)}>{socialFormatList.filter((item) => item.width === 1080).map((item) => <option value={item.id} key={item.id}>{item.platform} · {item.label} · {item.width} × {item.height}</option>)}</select></div>
      <div className="field"><label htmlFor="carousel-title">Título</label><textarea id="carousel-title" maxLength={100} value={active.title} onChange={(event) => update({ title: event.target.value })} /></div><div className="field"><label htmlFor="carousel-caption">Texto de apoio</label><textarea id="carousel-caption" maxLength={180} value={active.caption} onChange={(event) => update({ caption: event.target.value })} /></div>
      <div className="input-row"><div className="field"><label htmlFor="carousel-background">Fundo</label><input id="carousel-background" type="color" value={active.background} onChange={(event) => update({ background: event.target.value.toUpperCase() })} /></div><div className="field"><label htmlFor="carousel-foreground">Texto</label><input id="carousel-foreground" type="color" value={active.foreground} onChange={(event) => update({ foreground: event.target.value.toUpperCase() })} /></div></div>
      <div className="field"><label htmlFor="carousel-image">Imagem opcional</label><input id="carousel-image" type="file" accept="image/*" onChange={selectImage} /></div>
      <div className="compact-actions"><button className="button button-primary" type="button" onClick={downloadOne}><Download size={15} /> PNG atual</button><button className="button button-quiet" type="button" onClick={downloadAll}><Download size={15} /> Todos em ZIP</button></div><p className={`status ${status.error ? "status--error" : ""}`} role="status">{status.message}</p>
    </section>
    <section className="panel preview-panel"><div className="carousel-canvas-preview" style={{ aspectRatio: `${size.width}/${size.height}`, background: active.background, color: active.foreground }}><i style={{ background: active.accent }} /><b>SLIDE {slides.findIndex((slide) => slide.id === active.id) + 1}/{slides.length}</b><h2>{active.title}</h2><p>{active.caption}</p>{active.image ? <img src={active.image.url} alt="Imagem do slide" /> : <span className="canvas-placeholder">Imagem opcional</span>}</div></section>
    <section className="panel social-inspector"><h2>Template rápido</h2><p className="panel-help">Aplique uma direção para o slide selecionado.</p><div className="template-stack"><button type="button" onClick={() => update({ background: "#F6DDE2", foreground: "#622E3B", accent: "#B83B4B" })}>Cereja editorial</button><button type="button" onClick={() => update({ background: "#622E3B", foreground: "#FFF8F1", accent: "#E9A3AD" })}>Noite cereja</button><button type="button" onClick={() => update({ background: "#E7EEE5", foreground: "#294535", accent: "#6B7563" })}>Caderno verde</button></div><p className="mini-note">A prévia é proporcional; a exportação usa {size.width} × {size.height}px.</p></section>
  </div>;
}

export function SocialImageResizerStudio() {
  const [images, setImages] = useState<LocalImage[]>([]);
  const [format, setFormat] = useState<SocialFormatId>("instagramPortrait");
  const [focusX, setFocusX] = useState(50);
  const [focusY, setFocusY] = useState(50);
  const [status, setStatus] = useState("Escolha uma ou mais imagens; o processamento acontece no navegador.");
  const preset = socialFormats[format];
  const choose = (event: ChangeEvent<HTMLInputElement>) => setImages(pickImages(event, true).slice(0, 20));
  const render = async (image: LocalImage) => {
    const source = await imageFor(image);
    if (!source) throw new Error("Não foi possível abrir a imagem.");
    const canvas = document.createElement("canvas");
    canvas.width = preset.width; canvas.height = preset.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas indisponível.");
    context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height);
    drawCover(context, source, source.naturalWidth, source.naturalHeight, 0, 0, canvas.width, canvas.height, focusX / 100, focusY / 100);
    return canvasBlob(canvas);
  };
  const download = async () => {
    if (!images.length) return setStatus("Adicione ao menos uma imagem primeiro.");
    try {
      if (images.length === 1) {
        const { downloadBlob } = await import("./browser-utils");
        downloadBlob(`cherry-${preset.id}-${images[0].name.replace(/\.[^.]+$/, "")}.png`, await render(images[0]));
      } else await exportPngZip(`cherry-${preset.id}-lote.zip`, images.map((image, index) => ({ name: `${String(index + 1).padStart(2, "0")}-${image.name.replace(/\.[^.]+$/, "")}.png`, render: () => render(image) })));
      setStatus(images.length === 1 ? "Imagem ajustada em PNG." : "Lote ZIP pronto para baixar.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível redimensionar as imagens."); }
  };
  return <div className="social-workspace social-workspace--editor"><section className="panel social-controls"><h2>Redimensionar em lote</h2><p className="panel-help">Os presets ficam centralizados no catálogo do Social Studio para atualização sem alterar o editor.</p><div className="field"><label htmlFor="resizer-format">Preset</label><select id="resizer-format" value={format} onChange={(event) => setFormat(event.target.value as SocialFormatId)}>{socialFormatList.map((item) => <option key={item.id} value={item.id}>{item.platform} · {item.label} · {item.width} × {item.height}</option>)}</select></div><div className="field"><label htmlFor="resize-images">Imagens (até 20)</label><input id="resize-images" type="file" accept="image/*" multiple onChange={choose} /></div><div className="range-field"><label htmlFor="resizer-x">Posição horizontal</label><output>{focusX}%</output><input id="resizer-x" type="range" value={focusX} min="0" max="100" onChange={(event) => setFocusX(Number(event.target.value))} /></div><div className="range-field"><label htmlFor="resizer-y">Posição vertical</label><output>{focusY}%</output><input id="resizer-y" type="range" value={focusY} min="0" max="100" onChange={(event) => setFocusY(Number(event.target.value))} /></div><button className="button button-primary" type="button" onClick={download}><Download size={15} /> {images.length > 1 ? "Baixar ZIP" : "Baixar PNG"}</button><p className="status" role="status">{status}</p></section><section className="panel preview-panel"><div className="resize-preview" style={{ aspectRatio: `${preset.width}/${preset.height}` }}>{images[0] ? <img src={images[0].url} alt="Prévia da primeira imagem" style={{ objectPosition: `${focusX}% ${focusY}%` }} /> : <span><ImageUp size={24} /> Prévia do recorte</span>}</div><p className="preview-caption">{preset.platform} · {preset.width} × {preset.height}px · {images.length} arquivo{images.length === 1 ? "" : "s"}</p></section><section className="panel social-inspector"><h2>Arquivos</h2><p className="panel-help">O primeiro arquivo aparece na prévia; todos usam o mesmo enquadramento no lote.</p><ul className="file-list">{images.map((image) => <li key={image.id}>{image.name}</li>) || <li>Nenhum arquivo escolhido.</li>}</ul></section></div>;
}

type ComposerMode = "thumbnail" | "story" | "post-mockup" | "text-overlay" | "meme";

const composerSetup: Record<ComposerMode, { format: SocialFormatId; heading: string; help: string }> = {
  thumbnail: { format: "youtubeThumbnail", heading: "Thumbnail Studio", help: "Imagem, texto, sombra e contorno são renderizados em camadas." },
  story: { format: "instagramStory", heading: "Story Designer", help: "Uma composição vertical com guia de respiro para conteúdo importante." },
  "post-mockup": { format: "instagramSquare", heading: "Post Mockup", help: "Modelo genérico com perfil explicitamente fictício." },
  "text-overlay": { format: "instagramPortrait", heading: "Text Overlay", help: "Texto, gradiente, transparência e contorno em uma camada exportável." },
  meme: { format: "instagramSquare", heading: "Meme & Quote Maker", help: "Use sua imagem ou um fundo original; as frases ficam em camadas editáveis." }
};

export function CanvasComposerStudio({ mode }: { mode: ComposerMode }) {
  const setup = composerSetup[mode];
  const [image, setImage] = useState<LocalImage>();
  const [title, setTitle] = useState(mode === "meme" ? "QUANDO A IDEIA FINALMENTE FUNCIONA" : mode === "thumbnail" ? "O detalhe que muda tudo" : "Uma ideia pede espaço");
  const [subtitle, setSubtitle] = useState(mode === "meme" ? "e você lembra de salvar" : "Um subtítulo curto para dar contexto.");
  const [background, setBackground] = useState(mode === "thumbnail" ? "#35151E" : "#F6DDE2");
  const [foreground, setForeground] = useState("#FFF8F1");
  const [accent, setAccent] = useState("#B83B4B");
  const [fontScale, setFontScale] = useState(100);
  const [status, setStatus] = useState("A composição será exportada em PNG no tamanho correto.");
  const preset = socialFormats[setup.format];
  const choose = (event: ChangeEvent<HTMLInputElement>) => setImage(pickImages(event)[0]);
  const render = async () => {
    const source = await imageFor(image);
    const width = preset.width; const height = preset.height;
    await exportCanvas(`cherry-${mode}.png`, width, height, (context) => {
      context.fillStyle = background; context.fillRect(0, 0, width, height);
      if (source) {
        context.save();
        if (mode === "post-mockup") {
          context.fillStyle = "#FFFDFC"; context.fillRect(width * .08, height * .07, width * .84, height * .86);
          drawContain(context, source, source.naturalWidth, source.naturalHeight, width * .11, height * .19, width * .78, height * .55);
        } else drawCover(context, source, source.naturalWidth, source.naturalHeight, 0, 0, width, height);
        context.restore();
      }
      if (mode === "text-overlay" || mode === "story") {
        const gradient = context.createLinearGradient(0, height * .3, 0, height);
        gradient.addColorStop(0, "transparent"); gradient.addColorStop(1, `${background}E6`);
        context.fillStyle = gradient; context.fillRect(0, 0, width, height);
      }
      if (mode === "post-mockup") {
        context.fillStyle = "#352A2D"; context.font = `700 ${Math.round(width * .027)}px system-ui`; context.fillText("perfil fictício · Cherry Studio", width * .14, height * .14);
        context.font = `${Math.round(width * .025)}px system-ui`; drawLines(context, title, width * .14, height * .8, width * .72, Math.round(width * .032), 2);
        context.fillStyle = "#746468"; context.font = `${Math.round(width * .019)}px system-ui`; drawLines(context, subtitle, width * .14, height * .88, width * .72, Math.round(width * .025), 2);
        return;
      }
      const isMeme = mode === "meme";
      const fontSize = Math.round(width * (isMeme ? .075 : .078) * (fontScale / 100));
      context.fillStyle = isMeme ? "#FFFFFF" : foreground;
      context.font = `900 ${fontSize}px Impact, Arial Black, sans-serif`;
      context.lineJoin = "round";
      context.strokeStyle = isMeme ? "#111111" : `${background}CC`;
      context.lineWidth = Math.max(4, fontSize * .11);
      context.textAlign = isMeme ? "center" : "left";
      const x = isMeme ? width / 2 : width * .09;
      const y = isMeme ? height * .15 : height * .3;
      const drawOutlined = (text: string, startY: number, maxLines: number) => {
        const words = text.trim().split(/\s+/); let line = ""; let count = 0;
        for (const word of words) { const next = line ? `${line} ${word}` : word; if (context.measureText(next).width > width * .82 && line) { context.strokeText(line, x, startY + count * fontSize * 1.02); context.fillText(line, x, startY + count * fontSize * 1.02); line = word; count++; if (count >= maxLines) return; } else line = next; }
        if (line && count < maxLines) { context.strokeText(line, x, startY + count * fontSize * 1.02); context.fillText(line, x, startY + count * fontSize * 1.02); }
      };
      drawOutlined(title, y, isMeme ? 2 : 3);
      if (isMeme) drawOutlined(subtitle, height * .88 - fontSize, 2);
      else { context.globalAlpha = .9; context.font = `600 ${Math.round(width * .027)}px system-ui`; context.fillStyle = foreground; context.strokeStyle = "transparent"; drawLines(context, subtitle, width * .09, height * .72, width * .75, Math.round(width * .037), 3); context.globalAlpha = 1; }
      if (mode === "story") { context.strokeStyle = "#FFFFFFAA"; context.setLineDash([width * .02, width * .015]); context.lineWidth = 2; context.strokeRect(width * .08, height * .13, width * .84, height * .72); context.setLineDash([]); }
    });
  };
  return <div className="social-workspace social-workspace--editor"><section className="panel social-controls"><h2>{setup.heading}</h2><p className="panel-help">{setup.help}</p><div className="field"><label htmlFor={`${mode}-image`}>Imagem de fundo</label><input id={`${mode}-image`} type="file" accept="image/*" onChange={choose} /></div><div className="field"><label htmlFor={`${mode}-title`}>{mode === "meme" ? "Texto superior" : "Título"}</label><textarea id={`${mode}-title`} value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} /></div><div className="field"><label htmlFor={`${mode}-subtitle`}>{mode === "meme" ? "Texto inferior" : "Texto de apoio"}</label><textarea id={`${mode}-subtitle`} value={subtitle} onChange={(event) => setSubtitle(event.target.value)} maxLength={160} /></div><div className="input-row"><div className="field"><label htmlFor={`${mode}-background`}>Cor base</label><input id={`${mode}-background`} type="color" value={background} onChange={(event) => setBackground(event.target.value.toUpperCase())} /></div><div className="field"><label htmlFor={`${mode}-foreground`}>Texto</label><input id={`${mode}-foreground`} type="color" value={foreground} onChange={(event) => setForeground(event.target.value.toUpperCase())} /></div></div><div className="range-field"><label htmlFor={`${mode}-scale`}>Escala do texto</label><output>{fontScale}%</output><input id={`${mode}-scale`} type="range" min="65" max="145" value={fontScale} onChange={(event) => setFontScale(Number(event.target.value))} /></div><button className="button button-primary" type="button" onClick={() => void render().then(() => setStatus("PNG pronto para baixar.")).catch((error: unknown) => setStatus(error instanceof Error ? error.message : "Não foi possível exportar."))}><Download size={15} /> Exportar PNG</button><p className="status" role="status">{status}</p></section><section className="panel preview-panel"><div className={`composer-preview composer-preview--${mode}`} style={{ aspectRatio: `${preset.width}/${preset.height}`, background, color: foreground }}>{image ? <img src={image.url} alt="Imagem escolhida" /> : <span className="canvas-placeholder"><ImageUp size={22} /> Sua imagem</span>}<div className="composer-preview__shade" /><div className="composer-preview__copy"><strong>{mode === "post-mockup" && "perfil fictício · "}{title}</strong><small>{subtitle}</small></div>{mode === "story" && <i className="story-guide" aria-hidden="true" />}</div><p className="preview-caption">{preset.width} × {preset.height}px · Camadas: fundo, imagem, texto e acabamento.</p></section><section className="panel social-inspector"><h2>Camadas</h2><ol className="layer-list"><li><Layers size={14} /> Fundo e gradiente</li><li><ImageUp size={14} /> Imagem opcional</li><li><GripVertical size={14} /> Texto, sombra e contorno</li></ol><p className="mini-note">O mockup usa perfil fictício para não se passar por conteúdo de terceiros.</p></section></div>;
}

export function InstagramGridStudio() {
  const [items, setItems] = useState<LocalImage[]>([]);
  const [dragging, setDragging] = useState<string>();
  const [status, setStatus] = useState("Esta ferramenta apenas simula um feed. Ela não acessa nem publica em contas reais.");
  const choose = (event: ChangeEvent<HTMLInputElement>) => setItems((current) => [...current, ...pickImages(event, true).slice(0, 18 - current.length)]);
  const drop = (event: DragEvent<HTMLButtonElement>, target: string) => { event.preventDefault(); if (!dragging || dragging === target) return; setItems((current) => { const from = current.findIndex((item) => item.id === dragging); const to = current.findIndex((item) => item.id === target); const next = [...current]; const [item] = next.splice(from, 1); next.splice(to, 0, item); return next; }); };
  const save = () => { try { window.localStorage.setItem("cherry-social-grid", JSON.stringify(items.map(({ id, name, url }) => ({ id, name, url })))); setStatus("Planejamento salvo neste navegador. Os arquivos continuam locais."); } catch { setStatus("O navegador não conseguiu salvar este planejamento."); } };
  return <div className="social-workspace social-workspace--editor"><section className="panel social-controls"><h2>Grade planejada</h2><p className="panel-help">Arraste os cards para reorganizar. As imagens não são enviadas a uma rede social.</p><div className="field"><label htmlFor="grid-images">Imagens (até 18)</label><input id="grid-images" type="file" accept="image/*" multiple onChange={choose} /></div><button type="button" className="button button-primary" onClick={save}>Salvar planejamento local</button><p className="status" role="status">{status}</p></section><section className="panel preview-panel"><div className="instagram-grid" aria-label="Prévia do feed simulado">{items.length ? items.map((item) => <button key={item.id} type="button" draggable onDragStart={() => setDragging(item.id)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, item.id)} onDragEnd={() => setDragging(undefined)} title={`Mover ${item.name}`}><img src={item.url} alt={`Card planejado ${item.name}`} /></button>) : <span className="empty-note">Adicione imagens para montar a sequência.</span>}</div></section><section className="panel social-inspector"><h2>Sequência</h2><p className="panel-help">{items.length} item{items.length === 1 ? "" : "s"} no plano.</p><ol className="file-list">{items.map((item, index) => <li key={item.id}>{index + 1}. {item.name}</li>)}</ol></section></div>;
}

export function SafeZoneStudio() {
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState("");
  const [kind, setKind] = useState<"image" | "video">("image");
  const [presetId, setPresetId] = useState("reels");
  const [status, setStatus] = useState("Os guias são configuráveis; confirme as interfaces das plataformas antes de publicar.");
  const videoRef = useRef<HTMLVideoElement>(null);
  const preset = safeZonePresets.find((item) => item.id === presetId) ?? safeZonePresets[0];
  const choose = (event: ChangeEvent<HTMLInputElement>) => { const next = event.target.files?.[0]; if (!next || (!next.type.startsWith("image/") && !next.type.startsWith("video/"))) return; if (url) URL.revokeObjectURL(url); setFile(next); setUrl(URL.createObjectURL(next)); setKind(next.type.startsWith("video/") ? "video" : "image"); };
  const exportGuide = async () => {
    try {
      await exportCanvas(`cherry-safe-zone-${preset.id}.png`, preset.format.width, preset.format.height, async (context) => {
        context.fillStyle = "#F6DDE2"; context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        if (file && kind === "image") { const source = await imageFor({ id: "safe", name: file.name, file, url }); if (source) drawCover(context, source, source.naturalWidth, source.naturalHeight, 0, 0, context.canvas.width, context.canvas.height); }
        if (kind === "video" && videoRef.current && videoRef.current.readyState >= 2) drawCover(context, videoRef.current, videoRef.current.videoWidth, videoRef.current.videoHeight, 0, 0, context.canvas.width, context.canvas.height);
        const { top, right, bottom, left } = preset.safe;
        context.fillStyle = "rgba(184,59,75,.32)";
        context.fillRect(0, 0, context.canvas.width, top); context.fillRect(0, context.canvas.height - bottom, context.canvas.width, bottom); context.fillRect(0, 0, left, context.canvas.height); context.fillRect(context.canvas.width - right, 0, right, context.canvas.height);
        context.strokeStyle = "#FFFFFF"; context.lineWidth = 5; context.setLineDash([18, 12]); context.strokeRect(left, top, context.canvas.width - left - right, context.canvas.height - top - bottom); context.setLineDash([]);
      });
      setStatus("Quadro-guia PNG pronto para baixar.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível exportar o quadro."); }
  };
  return <div className="social-workspace social-workspace--editor"><section className="panel social-controls"><h2>Áreas seguras</h2><p className="panel-help">O checker mostra sobreposições aproximadas para ajudar na revisão, não publica nem altera o seu vídeo.</p><div className="field"><label htmlFor="safe-preset">Preset</label><select id="safe-preset" value={presetId} onChange={(event) => setPresetId(event.target.value)}>{safeZonePresets.map((item) => <option value={item.id} key={item.id}>{item.label} · {item.format.width} × {item.format.height}</option>)}</select></div><div className="field"><label htmlFor="safe-file">Imagem ou vídeo</label><input id="safe-file" type="file" accept="image/*,video/*" onChange={choose} /></div><button type="button" className="button button-primary" onClick={() => void exportGuide()}><Download size={15} /> Baixar quadro-guia PNG</button><p className="status" role="status">{status}</p></section><section className="panel preview-panel"><div className="safe-zone-preview" style={{ aspectRatio: `${preset.format.width}/${preset.format.height}` }}>{url ? kind === "image" ? <img src={url} alt="Mídia com áreas seguras" /> : <video ref={videoRef} src={url} controls muted playsInline /> : <span className="canvas-placeholder"><ImageUp size={22} /> Carregue uma mídia</span>}<i style={{ top: `${preset.safe.top / preset.format.height * 100}%`, right: `${preset.safe.right / preset.format.width * 100}%`, bottom: `${preset.safe.bottom / preset.format.height * 100}%`, left: `${preset.safe.left / preset.format.width * 100}%` }} /><b>Área segura</b></div></section><section className="panel social-inspector"><h2>{preset.label}</h2><p className="panel-help">Margens atuais: topo {preset.safe.top}px · direita {preset.safe.right}px · base {preset.safe.bottom}px · esquerda {preset.safe.left}px.</p><p className="mini-note">{preset.sourceNote}</p></section></div>;
}

export function WatermarkStudio() {
  const [images, setImages] = useState<LocalImage[]>([]);
  const [label, setLabel] = useState("© Cherry Atelier");
  const [opacity, setOpacity] = useState(72);
  const [position, setPosition] = useState("bottom-right");
  const [status, setStatus] = useState("Envie imagens para aplicar uma marca-d’água localmente.");
  const choose = (event: ChangeEvent<HTMLInputElement>) => setImages(pickImages(event, true).slice(0, 20));
  const render = async (image: LocalImage) => {
    const source = await imageFor(image); if (!source) throw new Error("Não foi possível abrir a imagem.");
    const width = source.naturalWidth; const height = source.naturalHeight;
    const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
    const context = canvas.getContext("2d"); if (!context) throw new Error("Canvas indisponível.");
    context.drawImage(source, 0, 0); context.globalAlpha = opacity / 100; context.fillStyle = "#FFFFFF"; context.strokeStyle = "#000000"; context.lineWidth = Math.max(2, width * .0025); context.font = `700 ${Math.max(22, width * .04)}px system-ui`;
    const padding = width * .045; const textWidth = context.measureText(label).width;
    const x = position.includes("right") ? width - padding - textWidth : padding; const y = position.includes("bottom") ? height - padding : padding + width * .04;
    context.strokeText(label, x, y); context.fillText(label, x, y); context.globalAlpha = 1;
    return canvasBlob(canvas);
  };
  const download = async () => { if (!images.length) return setStatus("Adicione imagens antes de exportar."); try { if (images.length === 1) { const { downloadBlob } = await import("./browser-utils"); downloadBlob(`cherry-watermark-${images[0].name.replace(/\.[^.]+$/, "")}.png`, await render(images[0])); } else await exportPngZip("cherry-watermark-lote.zip", images.map((image) => ({ name: `watermark-${image.name.replace(/\.[^.]+$/, "")}.png`, render: () => render(image) }))); setStatus(images.length === 1 ? "PNG com marca-d’água pronto." : "ZIP do lote pronto."); } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível aplicar a marca-d’água."); } };
  return <div className="social-workspace social-workspace--editor"><section className="panel social-controls"><h2>Marca-d’água em lote</h2><p className="panel-help">Use apenas em materiais sobre os quais você tem direitos.</p><div className="field"><label htmlFor="watermark-files">Imagens (até 20)</label><input id="watermark-files" type="file" accept="image/*" multiple onChange={choose} /></div><div className="field"><label htmlFor="watermark-text">Texto</label><input id="watermark-text" value={label} maxLength={60} onChange={(event) => setLabel(event.target.value)} /></div><div className="field"><label htmlFor="watermark-position">Posição</label><select id="watermark-position" value={position} onChange={(event) => setPosition(event.target.value)}><option value="bottom-right">Inferior direita</option><option value="bottom-left">Inferior esquerda</option><option value="top-right">Superior direita</option><option value="top-left">Superior esquerda</option></select></div><div className="range-field"><label htmlFor="watermark-opacity">Opacidade</label><output>{opacity}%</output><input id="watermark-opacity" type="range" min="15" max="100" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /></div><button className="button button-primary" type="button" onClick={() => void download()}><Download size={15} /> {images.length > 1 ? "Baixar ZIP" : "Baixar PNG"}</button><p className="status" role="status">{status}</p></section><section className="panel preview-panel"><div className="watermark-preview">{images[0] ? <img src={images[0].url} alt="Prévia com marca d’água" /> : <span className="canvas-placeholder"><ImageUp size={22} /> Prévia</span>}<b className={`watermark-preview__label watermark-preview__label--${position}`} style={{ opacity: opacity / 100 }}>{label}</b></div></section><section className="panel social-inspector"><h2>{images.length} arquivo{images.length === 1 ? "" : "s"}</h2><p className="panel-help">A exportação não envia nem guarda uma cópia dos arquivos no servidor.</p></section></div>;
}
