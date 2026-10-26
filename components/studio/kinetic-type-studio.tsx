"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Play } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools/catalog";
import { canvasPng, canvasWebm, supportedWebmMime, waitForWebFonts } from "@/lib/tools/export";
import { downloadBlob } from "./browser-utils";

type Props = { tool: ToolDefinition & { kind: "kinetic-type" } };
type Motion = "rise" | "wave" | "pulse";

function drawKineticFrame(canvas: HTMLCanvasElement, progress: number, text: string, motion: Motion, background: string, ink: string) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const { width, height } = canvas;
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "rgb(255 255 255 / .16)";
  context.beginPath();
  context.arc(width * (.18 + progress * .64), height * .2, width * .12, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "rgb(255 255 255 / .1)";
  context.beginPath();
  context.arc(width * (.88 - progress * .64), height * .78, width * .2, 0, Math.PI * 2);
  context.fill();
  context.textAlign = "center";
  context.textBaseline = "middle";
  const chars = Array.from(text || " ").slice(0, 24);
  const start = width / 2 - ((chars.length - 1) * 67) / 2;
  chars.forEach((char, index) => {
    const phase = progress * Math.PI * 2 + index * .33;
    const y = motion === "wave" ? Math.sin(phase) * 50 : motion === "rise" ? (1 - progress) * 160 : 0;
    const scale = motion === "pulse" ? 1 + Math.sin(phase) * .16 : 1;
    const opacity = motion === "rise" ? Math.min(1, progress * 4) : .92 + Math.sin(phase) * .08;
    context.save();
    context.translate(start + index * 67, height / 2 + y);
    context.scale(scale, scale);
    context.globalAlpha = opacity;
    context.fillStyle = ink;
    context.font = '400 118px "Instrument Serif", serif';
    context.fillText(char, 0, 0);
    context.restore();
  });
  context.globalAlpha = 1;
  context.fillStyle = ink;
  context.font = '800 25px "DM Sans", sans-serif';
  context.fillText("TIPOGRAFIA EM LOOP", width / 2, 104);
  context.font = '600 21px "DM Sans", sans-serif';
  context.globalAlpha = .72;
  context.fillText("um movimento breve, criado no seu navegador", width / 2, height - 92);
  context.globalAlpha = 1;
}

export function KineticTypeStudio({ tool: _tool }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("RESPIRAR");
  const [motion, setMotion] = useState<Motion>("wave");
  const [background, setBackground] = useState("#622E3B");
  const [ink, setInk] = useState("#FFF8F1");
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [status, setStatus] = useState("");

  const draw = useCallback((canvas: HTMLCanvasElement, progress: number) => drawKineticFrame(canvas, progress, text, motion, background, ink), [background, ink, motion, text]);

  useEffect(() => {
    setVideoAvailable(Boolean(supportedWebmMime()));
    let frame = 0;
    let active = true;
    const render = (now: number) => {
      if (!active) return;
      const canvas = canvasRef.current;
      if (canvas) draw(canvas, (now % 2600) / 2600);
      frame = requestAnimationFrame(render);
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const canvas = canvasRef.current;
      if (canvas) draw(canvas, .5);
    } else frame = requestAnimationFrame(render);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, [draw]);

  const downloadPng = async () => {
    try {
      await waitForWebFonts();
      const canvas = canvasRef.current;
      if (!canvas) return;
      draw(canvas, .5);
      downloadBlob("cherry-kinetic-type.png", await canvasPng(canvas));
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
      const video = await canvasWebm({ canvas, durationMs: 2400, frameRate: 30, drawFrame: (progress) => draw(canvas, progress) });
      downloadBlob("cherry-kinetic-type.webm", video);
      setStatus("Vídeo WebM pronto para baixar.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível criar o vídeo.");
    }
  };

  return <div className="workspace">
    <section className="panel"><h2>Letras em loop</h2><p className="panel-help">A animação acontece no canvas local. O PNG captura um quadro; o WebM guarda o movimento.</p><div className="field"><label htmlFor="kinetic-type-copy">Palavra ou frase curta</label><input id="kinetic-type-copy" maxLength={24} value={text} onChange={(event) => setText(event.target.value.toUpperCase())} /></div><div className="field"><label htmlFor="kinetic-type-motion">Movimento</label><select id="kinetic-type-motion" value={motion} onChange={(event) => setMotion(event.target.value as Motion)}><option value="wave">Onda</option><option value="rise">Entrada</option><option value="pulse">Pulso</option></select></div><div className="input-row"><div className="field"><label htmlFor="kinetic-type-background">Fundo</label><input id="kinetic-type-background" type="color" value={background} onChange={(event) => setBackground(event.target.value.toUpperCase())} /></div><div className="field"><label htmlFor="kinetic-type-ink">Texto</label><input id="kinetic-type-ink" type="color" value={ink} onChange={(event) => setInk(event.target.value.toUpperCase())} /></div></div></section>
    <section className="panel preview-panel canvas-preview-panel"><canvas ref={canvasRef} width={1600} height={1000} className="design-canvas" role="img" aria-label="Prévia de tipografia cinética">A prévia será renderizada aqui.</canvas><div className="canvas-preview-actions"><button className="button button-primary button-small" type="button" onClick={downloadPng}><Download size={14} /> Baixar PNG</button><button className="button button-quiet button-small" type="button" onClick={downloadVideo} disabled={!videoAvailable} title={videoAvailable ? undefined : "Seu navegador não oferece gravação WebM."}><Play size={14} /> Baixar WebM</button>{status && <p className="status" role="status">{status}</p>}</div></section>
  </div>;
}
