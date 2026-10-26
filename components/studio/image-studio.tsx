"use client";
/* eslint-disable @next/next/no-img-element -- local object URLs are generated in the browser and cannot use Next's image optimizer. */

import { ChangeEvent, useState } from "react";
import { Download, ImageUp, RotateCw } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools/catalog";
import { fitDimensions, quantizeChannel, sourceCrop } from "@/lib/tools/image";
import { canvasBlob, downloadBlob, fileStem, fileToImage } from "./browser-utils";

type ImageToolKind = Extract<ToolDefinition["kind"], "resize" | "compress" | "convert" | "crop" | "pixel">;
type Props = { tool: ToolDefinition & { kind: ImageToolKind } };
type LoadedFile = { file: File; url: string };

const accept = "image/png,image/jpeg,image/webp,image/avif";
const mimeExtension: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/avif": "avif" };

function FilePicker({ id, multiple = false, onPick }: { id: string; multiple?: boolean; onPick: (files: LoadedFile[]) => void }) {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = [...(event.target.files ?? [])].map((file) => ({ file, url: URL.createObjectURL(file) }));
    if (selected.length) onPick(selected);
  };
  return <div className="upload-box"><ImageUp size={21} aria-hidden="true" /><label htmlFor={id}>Escolher {multiple ? "imagens" : "uma imagem"}</label><input id={id} type="file" accept={accept} multiple={multiple} onChange={onChange} /><small>PNG, JPG, WEBP ou AVIF</small></div>;
}

function CanvasPreview({ source, alt, pixelated = false }: { source?: string; alt: string; pixelated?: boolean }) {
  return source ? <img className={pixelated ? "canvas-image canvas-image--pixel" : "canvas-image"} src={source} alt={alt} /> : <p className="empty-note">Sua prévia aparecerá aqui.</p>;
}

function ImageResizer() {
  const [files, setFiles] = useState<LoadedFile[]>([]);
  const [width, setWidth] = useState(1600);
  const [height, setHeight] = useState<number | "">("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [status, setStatus] = useState("Escolha uma ou mais imagens.");
  const process = async () => {
    if (!files.length) return;
    try {
      setStatus("Preparando seus arquivos…");
      for (const { file } of files) {
        const image = await fileToImage(file);
        const dimensions = fitDimensions({ width: image.naturalWidth, height: image.naturalHeight }, { width, height: height === "" ? null : height, keepRatio });
        const canvas = document.createElement("canvas"); canvas.width = dimensions.width; canvas.height = dimensions.height;
        canvas.getContext("2d")?.drawImage(image, 0, 0, dimensions.width, dimensions.height);
        const blob = await canvasBlob(canvas, file.type === "image/png" ? "image/png" : "image/jpeg", .92);
        downloadBlob(`${fileStem(file.name)}-${dimensions.width}x${dimensions.height}.${blob.type === "image/png" ? "png" : "jpg"}`, blob);
      }
      setStatus(`${files.length} ${files.length === 1 ? "imagem foi exportada" : "imagens foram exportadas"}.`);
    } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível redimensionar estas imagens."); }
  };
  return <div className="workspace"><section className="panel"><h2>Arquivos</h2><p className="panel-help">Cada download é gerado localmente.</p><FilePicker id="resize-file" multiple onPick={setFiles} /><div className="field"><label htmlFor="resize-width">Largura (px)</label><input id="resize-width" type="number" min="1" value={width} onChange={(event) => setWidth(Math.max(1, Number(event.target.value)))} /></div><div className="field"><label htmlFor="resize-height">Altura (px)</label><input id="resize-height" type="number" min="1" value={height} onChange={(event) => setHeight(event.target.value ? Math.max(1, Number(event.target.value)) : "")} /></div><label className="check-field"><input type="checkbox" checked={keepRatio} onChange={(event) => setKeepRatio(event.target.checked)} /> Manter proporção</label><div className="control-actions"><button className="button button-primary" type="button" disabled={!files.length} onClick={process}><Download size={15} /> Redimensionar e baixar</button></div><p className="status" role="status">{status}</p></section><section className="panel preview-panel"><CanvasPreview source={files[0]?.url} alt="Prévia da imagem selecionada" /><p className="preview-caption">{files.length ? `${files.length} ${files.length === 1 ? "arquivo selecionado" : "arquivos selecionados"}` : "Processamento em lote quando você precisar."}</p></section><section className="panel"><h2>Tamanho de saída</h2><p className="panel-help">Com a proporção ativa, alterar a largura calcula a altura automaticamente na exportação.</p><div className="stat-stack"><span>{width}px</span><small>largura alvo</small></div></section></div>;
}

function ImageCompressor() {
  const [picked, setPicked] = useState<LoadedFile>();
  const [quality, setQuality] = useState(78);
  const [result, setResult] = useState<{ url: string; blob: Blob }>();
  const [status, setStatus] = useState("A qualidade pode ser ajustada antes da exportação.");
  const process = async () => {
    if (!picked) return;
    try {
      setStatus("Comprimindo no seu navegador…");
      const image = await fileToImage(picked.file);
      const canvas = document.createElement("canvas"); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      canvas.getContext("2d")?.drawImage(image, 0, 0);
      const blob = await canvasBlob(canvas, "image/webp", quality / 100);
      setResult({ blob, url: URL.createObjectURL(blob) });
      setStatus(`Pronto — ${(blob.size / 1024).toFixed(1)} KB para baixar.`);
    } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível comprimir esta imagem."); }
  };
  const savings = picked && result ? Math.round((1 - result.blob.size / picked.file.size) * 100) : null;
  return <div className="workspace"><section className="panel"><h2>Imagem original</h2><p className="panel-help">Exporta para WEBP com transparência quando possível.</p><FilePicker id="compress-file" onPick={(files) => { setPicked(files[0]); setResult(undefined); }} /><div className="range-field"><label htmlFor="compress-quality">Qualidade</label><output>{quality}%</output><input id="compress-quality" type="range" min="20" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} /></div><div className="control-actions"><button className="button button-primary" disabled={!picked} type="button" onClick={process}>Comparar tamanho</button></div><p className="status" role="status">{status}</p></section><section className="panel preview-panel"><CanvasPreview source={result?.url ?? picked?.url} alt="Prévia da compressão" />{savings !== null && <span className="result-tag">{savings >= 0 ? `${savings}% menor` : "arquivo maior"}</span>}</section><section className="panel"><h2>Comparação</h2><p className="panel-help">A escolha é sua: veja a prévia antes de baixar.</p><div className="size-compare"><span>Original <b>{picked ? `${(picked.file.size / 1024).toFixed(1)} KB` : "—"}</b></span><span>Nova <b>{result ? `${(result.blob.size / 1024).toFixed(1)} KB` : "—"}</b></span></div><button className="button button-quiet" disabled={!result || !picked} type="button" onClick={() => result && picked && downloadBlob(`${fileStem(picked.file.name)}-compressed.webp`, result.blob)}><Download size={15} /> Baixar WEBP</button></section></div>;
}

function FormatConverter() {
  const [picked, setPicked] = useState<LoadedFile>();
  const [format, setFormat] = useState("image/png");
  const [result, setResult] = useState<{ blob: Blob; url: string }>();
  const [status, setStatus] = useState("Selecione um arquivo e o formato de saída.");
  const process = async () => {
    if (!picked) return;
    try {
      const image = await fileToImage(picked.file); const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth; canvas.height = image.naturalHeight; canvas.getContext("2d")?.drawImage(image, 0, 0);
      const blob = await canvasBlob(canvas, format, .92);
      setResult({ blob, url: URL.createObjectURL(blob) });
      setStatus(blob.type === format ? `Convertido para ${mimeExtension[format]?.toUpperCase()}.` : "Seu navegador não ofereceu esse formato; a saída disponível foi mantida.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível converter este arquivo."); }
  };
  const extension = result ? (mimeExtension[result.blob.type] ?? "png") : (mimeExtension[format] ?? "png");
  return <div className="workspace"><section className="panel"><h2>Converter localmente</h2><p className="panel-help">AVIF depende do suporte do navegador; sempre mostramos o resultado real.</p><FilePicker id="convert-file" onPick={(files) => { setPicked(files[0]); setResult(undefined); }} /><div className="field"><label htmlFor="convert-format">Formato de saída</label><select id="convert-format" value={format} onChange={(event) => setFormat(event.target.value)}><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WEBP</option><option value="image/avif">AVIF (quando suportado)</option></select></div><button className="button button-primary" disabled={!picked} type="button" onClick={process}>Converter</button><p className="status" role="status">{status}</p></section><section className="panel preview-panel"><CanvasPreview source={result?.url ?? picked?.url} alt="Prévia da conversão" /></section><section className="panel"><h2>Arquivo convertido</h2><p className="panel-help">Nenhum upload foi feito.</p><button className="button button-quiet" disabled={!result || !picked} type="button" onClick={() => result && picked && downloadBlob(`${fileStem(picked.file.name)}.${extension}`, result.blob)}><Download size={15} /> Baixar {extension.toUpperCase()}</button></section></div>;
}

function Cropper() {
  const [picked, setPicked] = useState<LoadedFile>();
  const [crop, setCrop] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; url: string }>();
  const [status, setStatus] = useState("Defina o recorte como porcentagem da imagem.");
  const updateCrop = (key: keyof typeof crop, value: number) => setCrop((current) => ({ ...current, [key]: Math.max(0, Math.min(100, value)) }));
  const process = async () => {
    if (!picked) return;
    try {
      const image = await fileToImage(picked.file);
      const area = sourceCrop(image.naturalWidth, image.naturalHeight, crop);
      const source = document.createElement("canvas"); source.width = area.width; source.height = area.height;
      source.getContext("2d")?.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
      const quarterTurn = Math.abs(rotation % 180) === 90;
      const canvas = document.createElement("canvas"); canvas.width = quarterTurn ? source.height : source.width; canvas.height = quarterTurn ? source.width : source.height;
      const context = canvas.getContext("2d"); if (!context) throw new Error("O canvas não está disponível.");
      context.translate(canvas.width / 2, canvas.height / 2); context.rotate((rotation * Math.PI) / 180); context.drawImage(source, -source.width / 2, -source.height / 2);
      const blob = await canvasBlob(canvas, "image/png"); setResult({ blob, url: URL.createObjectURL(blob) }); setStatus("Recorte pronto para exportar.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível recortar esta imagem."); }
  };
  return <div className="workspace"><section className="panel"><h2>Enquadramento</h2><p className="panel-help">Use proporções ou valores livres. A prévia final aparece ao aplicar.</p><FilePicker id="crop-file" onPick={(files) => { setPicked(files[0]); setResult(undefined); }} /><div className="preset-row"><button type="button" onClick={() => setCrop({ x: 0, y: 0, width: 100, height: 100 })}>Livre</button><button type="button" onClick={() => setCrop({ x: 5, y: 22, width: 90, height: 56 })}>16:9</button><button type="button" onClick={() => setCrop({ x: 12, y: 0, width: 76, height: 100 })}>4:5</button><button type="button" onClick={() => setCrop({ x: 0, y: 0, width: 100, height: 100 })}>1:1</button></div><div className="crop-grid">{(Object.keys(crop) as Array<keyof typeof crop>).map((key) => <div className="field" key={key}><label htmlFor={`crop-${key}`}>{key === "x" ? "Esquerda" : key === "y" ? "Topo" : key === "width" ? "Largura" : "Altura"} (%)</label><input id={`crop-${key}`} type="number" min="0" max="100" value={crop[key]} onChange={(event) => updateCrop(key, Number(event.target.value))} /></div>)}</div><div className="range-field"><label htmlFor="crop-rotation">Rotação</label><output>{rotation}°</output><input id="crop-rotation" type="range" min="0" max="270" step="90" value={rotation} onChange={(event) => setRotation(Number(event.target.value))} /></div><button className="button button-primary" disabled={!picked} type="button" onClick={process}><RotateCw size={15} /> Aplicar recorte</button><p className="status" role="status">{status}</p></section><section className="panel preview-panel"><CanvasPreview source={result?.url ?? picked?.url} alt="Prévia do recorte" /></section><section className="panel"><h2>Exportar</h2><p className="panel-help">PNG mantém transparência quando existir.</p><button className="button button-quiet" disabled={!result || !picked} type="button" onClick={() => result && picked && downloadBlob(`${fileStem(picked.file.name)}-crop.png`, result.blob)}><Download size={15} /> Baixar PNG</button></section></div>;
}

function PixelArt() {
  const [picked, setPicked] = useState<LoadedFile>();
  const [pixels, setPixels] = useState(64);
  const [levels, setLevels] = useState(6);
  const [result, setResult] = useState<{ blob: Blob; url: string }>();
  const [status, setStatus] = useState("Quanto menor a resolução, mais gráfico fica o resultado.");
  const process = async () => {
    if (!picked) return;
    try {
      const image = await fileToImage(picked.file); const ratio = image.naturalHeight / image.naturalWidth;
      const small = document.createElement("canvas"); small.width = pixels; small.height = Math.max(1, Math.round(pixels * ratio));
      const smallContext = small.getContext("2d", { willReadFrequently: true }); if (!smallContext) throw new Error("O canvas não está disponível.");
      smallContext.imageSmoothingEnabled = false; smallContext.drawImage(image, 0, 0, small.width, small.height);
      const pixelsData = smallContext.getImageData(0, 0, small.width, small.height);
      for (let index = 0; index < pixelsData.data.length; index += 4) { pixelsData.data[index] = quantizeChannel(pixelsData.data[index], levels); pixelsData.data[index + 1] = quantizeChannel(pixelsData.data[index + 1], levels); pixelsData.data[index + 2] = quantizeChannel(pixelsData.data[index + 2], levels); }
      smallContext.putImageData(pixelsData, 0, 0);
      const output = document.createElement("canvas"); output.width = image.naturalWidth; output.height = image.naturalHeight;
      const outputContext = output.getContext("2d"); if (!outputContext) throw new Error("O canvas não está disponível."); outputContext.imageSmoothingEnabled = false; outputContext.drawImage(small, 0, 0, output.width, output.height);
      const blob = await canvasBlob(output, "image/png"); setResult({ blob, url: URL.createObjectURL(blob) }); setStatus("Pixel art pronta para exportar.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível converter esta imagem."); }
  };
  return <div className="workspace"><section className="panel"><h2>Reduza com intenção</h2><p className="panel-help">Cada canal de cor é quantizado no seu navegador.</p><FilePicker id="pixel-file" onPick={(files) => { setPicked(files[0]); setResult(undefined); }} /><div className="range-field"><label htmlFor="pixel-size">Resolução horizontal</label><output>{pixels}px</output><input id="pixel-size" type="range" min="16" max="180" value={pixels} onChange={(event) => setPixels(Number(event.target.value))} /></div><div className="range-field"><label htmlFor="pixel-levels">Cores por canal</label><output>{levels}</output><input id="pixel-levels" type="range" min="2" max="24" value={levels} onChange={(event) => setLevels(Number(event.target.value))} /></div><button className="button button-primary" disabled={!picked} type="button" onClick={process}>Converter em pixel art</button><p className="status" role="status">{status}</p></section><section className="panel preview-panel"><CanvasPreview source={result?.url ?? picked?.url} alt="Prévia da pixel art" pixelated /></section><section className="panel"><h2>PNG final</h2><p className="panel-help">Preserva as bordas duras e as cores reduzidas.</p><button className="button button-quiet" disabled={!result || !picked} type="button" onClick={() => result && picked && downloadBlob(`${fileStem(picked.file.name)}-pixel-art.png`, result.blob)}><Download size={15} /> Baixar PNG</button></section></div>;
}

export function ImageStudio({ tool }: Props) {
  if (tool.kind === "resize") return <ImageResizer />;
  if (tool.kind === "compress") return <ImageCompressor />;
  if (tool.kind === "convert") return <FormatConverter />;
  if (tool.kind === "crop") return <Cropper />;
  return <PixelArt />;
}
