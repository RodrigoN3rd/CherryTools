"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { copyText, downloadText } from "./browser-utils";

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
