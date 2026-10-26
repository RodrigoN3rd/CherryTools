"use client";
/* eslint-disable @next/next/no-img-element -- local object URLs are generated in the browser and cannot use Next's image optimizer. */

import { ChangeEvent, DragEvent, useState } from "react";
import { Download, ImageUp, Trash2 } from "lucide-react";
import { canvasBlob, downloadBlob, fileToImage } from "./browser-utils";

type BoardItem = { id: string; file: File; url: string; x: number; y: number };

const clamp = (value: number) => Math.max(0, Math.min(100, value));

function drawCover(context: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

export function MoodboardStudio() {
  const [items, setItems] = useState<BoardItem[]>([]);
  const [background, setBackground] = useState("#FFF8F1");
  const [note, setNote] = useState("Colete imagens, cores e palavras que apontam para a mesma atmosfera.");
  const [dragging, setDragging] = useState<string>();
  const [status, setStatus] = useState("Adicione até seis imagens e mova-as livremente na prancha.");
  const addFiles = (files: File[]) => {
    const accepted = files.filter((file) => file.type.startsWith("image/")).slice(0, 6 - items.length);
    if (!accepted.length) return;
    setItems((current) => [...current, ...accepted.map((file, index) => ({ id: `${file.name}-${file.lastModified}-${index}`, file, url: URL.createObjectURL(file), x: 8 + ((current.length + index) % 3) * 29, y: 9 + Math.floor((current.length + index) / 3) * 43 }))]);
    setStatus(`${accepted.length} ${accepted.length === 1 ? "imagem adicionada" : "imagens adicionadas"}. Arraste-as pela prancha.`);
  };
  const onInput = (event: ChangeEvent<HTMLInputElement>) => addFiles([...event.target.files ?? []]);
  const move = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/cherry-moodboard") || dragging;
    if (!id) {
      addFiles([...event.dataTransfer.files]);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100 - 14);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100 - 16);
    setItems((current) => current.map((item) => item.id === id ? { ...item, x, y } : item));
    setDragging(undefined);
  };
  const remove = (id: string) => setItems((current) => {
    const removed = current.find((item) => item.id === id);
    if (removed) URL.revokeObjectURL(removed.url);
    return current.filter((item) => item.id !== id);
  });
  const exportBoard = async () => {
    if (!items.length) return;
    try {
      setStatus("Preparando seu moodboard em PNG…");
      const width = 1600;
      const height = 1000;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("O canvas não está disponível.");
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);
      context.fillStyle = "#622E3B";
      context.font = "italic 62px Georgia, serif";
      context.fillText("moodboard", 76, 105);
      context.font = "26px system-ui, sans-serif";
      context.fillStyle = "#746468";
      const words = note.split(" ");
      let line = "";
      let lineY = 155;
      for (const word of words) {
        const next = `${line}${word} `;
        if (context.measureText(next).width > 1040 && line) { context.fillText(line, 76, lineY); lineY += 34; line = `${word} `; } else line = next;
      }
      if (line) context.fillText(line, 76, lineY);
      for (const item of items) {
        const image = await fileToImage(item.file);
        const cardWidth = 360;
        const cardHeight = 300;
        const x = 76 + (item.x / 100) * (width - cardWidth - 152);
        const y = 235 + (item.y / 100) * (height - cardHeight - 310);
        context.save();
        context.fillStyle = "#FFFCFA";
        context.shadowColor = "rgba(98, 46, 59, .16)";
        context.shadowBlur = 20;
        context.shadowOffsetY = 8;
        context.fillRect(x - 10, y - 10, cardWidth + 20, cardHeight + 20);
        context.restore();
        context.save();
        context.beginPath();
        context.rect(x, y, cardWidth, cardHeight);
        context.clip();
        drawCover(context, image, x, y, cardWidth, cardHeight);
        context.restore();
      }
      const blob = await canvasBlob(canvas);
      downloadBlob("cherry-moodboard.png", blob);
      setStatus("Moodboard exportado em PNG.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Não foi possível exportar seu moodboard."); }
  };
  return <div className="workspace workspace--wide">
    <section className="panel"><h2>Materiais da prancha</h2><p className="panel-help">Use arquivos locais; eles não saem deste dispositivo.</p><div className="upload-box"><ImageUp size={21} aria-hidden="true" /><label htmlFor="moodboard-files">Adicionar imagens</label><input id="moodboard-files" type="file" accept="image/*" multiple onChange={onInput} /><small>Até seis imagens</small></div><div className="field"><label htmlFor="moodboard-background">Cor da prancha</label><input id="moodboard-background" type="color" value={background} onChange={(event) => setBackground(event.target.value.toUpperCase())} /></div><div className="field"><label htmlFor="moodboard-note">Nota de direção</label><textarea id="moodboard-note" value={note} onChange={(event) => setNote(event.target.value)} /></div><button className="button button-primary" type="button" disabled={!items.length} onClick={exportBoard}><Download size={15} /> Exportar PNG</button><p className="status" role="status">{status}</p></section>
    <section className="panel preview-panel"><div className="moodboard" style={{ background }} onDragOver={(event) => event.preventDefault()} onDrop={move} aria-label="Prancha visual para organizar imagens"><p>{note || "Uma nota pode orientar a coleção."}</p>{items.map((item) => <figure className="mood-card" draggable key={item.id} style={{ left: `${item.x}%`, top: `${item.y}%` }} onDragStart={(event) => { event.dataTransfer.setData("text/cherry-moodboard", item.id); setDragging(item.id); }}><img src={item.url} alt={`Referência ${item.file.name}`} /><button type="button" aria-label={`Remover ${item.file.name}`} onClick={() => remove(item.id)}><Trash2 size={14} /></button></figure>)}{!items.length && <span className="empty-note">Solte imagens aqui ou use o seletor.</span>}</div></section>
  </div>;
}
