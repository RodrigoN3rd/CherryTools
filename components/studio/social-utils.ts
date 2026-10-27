import { zipSync } from "fflate";
import { canvasBlob, downloadBlob, fileToImage } from "./browser-utils";

export type LocalImage = { id: string; name: string; file: File; url: string };

export const makeId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

export function drawCover(context: CanvasRenderingContext2D, image: CanvasImageSource, sourceWidth: number, sourceHeight: number, x: number, y: number, width: number, height: number, focusX = .5, focusY = .5) {
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  context.drawImage(image, x + (width - drawWidth) * focusX, y + (height - drawHeight) * focusY, drawWidth, drawHeight);
}

export function drawContain(context: CanvasRenderingContext2D, image: CanvasImageSource, sourceWidth: number, sourceHeight: number, x: number, y: number, width: number, height: number) {
  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

export function drawLines(context: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, lineHeight: number, maxLines: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  let line = "";
  let lineIndex = 0;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > width && line) {
      context.fillText(line, x, y + lineIndex * lineHeight);
      line = word;
      lineIndex += 1;
      if (lineIndex >= maxLines) return;
    } else line = next;
  }
  if (line && lineIndex < maxLines) context.fillText(line, x, y + lineIndex * lineHeight);
}

export async function imageFor(local?: LocalImage): Promise<HTMLImageElement | undefined> {
  return local ? fileToImage(local.file) : undefined;
}

export async function exportCanvas(filename: string, width: number, height: number, draw: (context: CanvasRenderingContext2D) => Promise<void> | void): Promise<void> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Seu navegador não conseguiu preparar a imagem.");
  await draw(context);
  downloadBlob(filename, await canvasBlob(canvas));
}

export async function exportPngZip(filename: string, items: Array<{ name: string; render: () => Promise<Blob> }>): Promise<void> {
  const archive: Record<string, Uint8Array> = {};
  for (const item of items) archive[item.name] = new Uint8Array(await (await item.render()).arrayBuffer());
  downloadBlob(filename, new Blob([zipSync(archive, { level: 6 })], { type: "application/zip" }));
}

export async function fileAsDataUrl(file: File): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Não foi possível ler este arquivo."));
    reader.onerror = () => reject(new Error("Não foi possível ler este arquivo."));
    reader.readAsDataURL(file);
  });
}

export function readLocalJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocalJson<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}
