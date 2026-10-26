"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { canvasPng, waitForWebFonts } from "@/lib/tools/export";
import { downloadBlob } from "./browser-utils";

export type CanvasDraw = (context: CanvasRenderingContext2D, width: number, height: number) => void;

type Options = {
  width: number;
  height: number;
  filename: string;
  draw: CanvasDraw;
};

export function useCanvasPng({ width, height, filename, draw }: Options) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("");

  const paint = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    await waitForWebFonts();
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Seu navegador não conseguiu preparar a prévia.");
    draw(context, width, height);
  }, [draw, height, width]);

  useEffect(() => {
    void paint().catch(() => setStatus("Não foi possível atualizar a prévia."));
  }, [paint]);

  const downloadPng = useCallback(async () => {
    try {
      await paint();
      const canvas = canvasRef.current;
      if (!canvas) return;
      downloadBlob(filename, await canvasPng(canvas));
      setStatus("PNG pronto para baixar.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível criar o PNG.");
    }
  }, [filename, paint]);

  return { canvasRef, downloadPng, status };
}
