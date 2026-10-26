"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Play } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools/catalog";
import { canvasPng, canvasWebm, supportedWebmMime, waitForWebFonts } from "@/lib/tools/export";
import { downloadBlob } from "./browser-utils";

type Props = { tool: ToolDefinition & { kind: "organic-background" } };

function Range({ id, label, value, min, max, step = 1, suffix = "", onChange }: { id: string; label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (value: number) => void }) {
  return <div className="range-field"><label htmlFor={id}>{label}</label><output>{value}{suffix}</output><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></div>;
}

function drawOrganicFrame(canvas: HTMLCanvasElement, progress: number, colors: string[], intensity: number) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const { width, height } = canvas;
  context.fillStyle = "#FFF8F1";
  context.fillRect(0, 0, width, height);
  context.globalCompositeOperation = "multiply";
  context.filter = `blur(${42 + intensity * .65}px)`;
  const orbit = intensity * 2.1;
  const points = [
    [width * (.23 + Math.sin(progress * Math.PI * 2) * orbit / width), height * (.28 + Math.cos(progress * Math.PI * 2) * orbit / height)],
    [width * (.76 + Math.sin(progress * Math.PI * 2 + 2.1) * orbit / width), height * (.24 + Math.cos(progress * Math.PI * 2 + 2.1) * orbit / height)],
    [width * (.31 + Math.sin(progress * Math.PI * 2 + 4.2) * orbit / width), height * (.78 + Math.cos(progress * Math.PI * 2 + 4.2) * orbit / height)],
    [width * (.79 + Math.sin(progress * Math.PI * 2 + 5.2) * orbit / width), height * (.72 + Math.cos(progress * Math.PI * 2 + 5.2) * orbit / height)]
  ];
  colors.forEach((color, index) => {
    const [x, y] = points[index];
    const radius = Math.max(width, height) * (.31 + index * .025);
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgb(255 248 241 / 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  });
  context.globalCompositeOperation = "source-over";
  context.filter = "none";
  context.fillStyle = "rgb(255 255 255 / .62)";
  context.fillRect(56, 56, 386, 116);
  context.fillStyle = "#352A2D";
  context.font = '800 24px "DM Sans", sans-serif';
  context.fillText("FUNDO ORGÂNICO", 88, 106);
  context.fillStyle = "#746468";
  context.font = '600 19px "DM Sans", sans-serif';
  context.fillText("movimento gerado localmente", 88, 140);
}

export function OrganicBackgroundStudio({ tool: _tool }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colors, setColors] = useState(["#B83B4B", "#F2BE80", "#A7D8CB", "#A7B8E8"]);
  const [intensity, setIntensity] = useState(54);
  const [speed, setSpeed] = useState(1);
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [status, setStatus] = useState("");
  const draw = useCallback((canvas: HTMLCanvasElement, progress: number) => drawOrganicFrame(canvas, progress, colors, intensity), [colors, intensity]);

  useEffect(() => {
    setVideoAvailable(Boolean(supportedWebmMime()));
    let frame = 0;
    let active = true;
    const render = (now: number) => {
      if (!active) return;
      const canvas = canvasRef.current;
      if (canvas) draw(canvas, ((now / 5400) * speed) % 1);
      frame = requestAnimationFrame(render);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const canvas = canvasRef.current;
      if (canvas) draw(canvas, .5);
    } else frame = requestAnimationFrame(render);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, [draw, speed]);

  const downloadPng = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      draw(canvas, .5);
      downloadBlob("cherry-organic-background.png", await canvasPng(canvas));
      setStatus("PNG pronto para baixar.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível criar o PNG.");
    }
  };

  const downloadVideo = async () => {
    try {
      setStatus("Renderizando seu loop em WebM…");
      await waitForWebFonts();
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 1000;
      const video = await canvasWebm({ canvas, durationMs: 2400, frameRate: 30, drawFrame: (progress) => draw(canvas, progress * speed % 1) });
      downloadBlob("cherry-organic-background.webm", video);
      setStatus("Vídeo WebM pronto para baixar.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível criar o vídeo.");
    }
  };

  return <div className="workspace"><section className="panel"><h2>Cor que se move</h2><p className="panel-help">O fundo é desenhado quadro a quadro no navegador. Use PNG para um instante ou WebM para o loop.</p><div className="color-pick-grid">{colors.map((color, index) => <div className="field" key={index}><label htmlFor={`organic-color-${index}`}>Cor {index + 1}</label><input id={`organic-color-${index}`} type="color" value={color} onChange={(event) => setColors((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value.toUpperCase() : item))} /></div>)}</div><Range id="organic-intensity" label="Amplitude" value={intensity} min={12} max={100} onChange={setIntensity} /><Range id="organic-speed" label="Velocidade" value={speed} min={.5} max={2} step={.1} suffix="×" onChange={setSpeed} /></section><section className="panel preview-panel canvas-preview-panel"><canvas ref={canvasRef} width={1600} height={1000} className="design-canvas" role="img" aria-label="Prévia de fundo orgânico animado">A prévia será renderizada aqui.</canvas><div className="canvas-preview-actions"><button className="button button-primary button-small" type="button" onClick={downloadPng}><Download size={14} /> Baixar PNG</button><button className="button button-quiet button-small" type="button" onClick={downloadVideo} disabled={!videoAvailable} title={videoAvailable ? undefined : "Seu navegador não oferece gravação WebM."}><Play size={14} /> Baixar WebM</button>{status && <p className="status" role="status">{status}</p>}</div></section></div>;
}
