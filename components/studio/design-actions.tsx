"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { copyText, downloadBlob, downloadText } from "./browser-utils";
import { canvasPng, waitForWebFonts } from "@/lib/tools/export";

export function CopyAction({ value, label = "Copiar CSS" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await copyText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return <button className="button button-quiet button-small" type="button" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copiado" : label}</button>;
}

export function DownloadAction({ filename, value, label = "Baixar" }: { filename: string; value: string; label?: string }) {
  return <button className="button button-quiet button-small" type="button" onClick={() => downloadText(filename, value, filename.endsWith(".svg") ? "image/svg+xml" : "text/css")}><Download size={14} /> {label}</button>;
}

export function PngDownloadAction({ filename, draw, width = 1600, height = 1000, disabled = false, label = "Baixar PNG" }: { filename: string; draw: (context: CanvasRenderingContext2D, width: number, height: number) => void; width?: number; height?: number; disabled?: boolean; label?: string }) {
  const [status, setStatus] = useState("");
  const download = async () => {
    try {
      await waitForWebFonts();
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Seu navegador não conseguiu preparar a imagem.");
      draw(context, width, height);
      downloadBlob(filename, await canvasPng(canvas));
      setStatus("PNG pronto.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível criar o PNG.");
    }
  };
  return <><button className="button button-quiet button-small" type="button" disabled={disabled} onClick={download}><Download size={14} /> {label}</button>{status && <span className="action-status" role="status">{status}</span>}</>;
}
