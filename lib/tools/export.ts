const webmMimes = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];

export function preferredWebmMime(isSupported: (mime: string) => boolean): string | null {
  return webmMimes.find(isSupported) ?? null;
}

export function supportedWebmMime(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  return preferredWebmMime((mime) => MediaRecorder.isTypeSupported(mime));
}

export async function waitForWebFonts(): Promise<void> {
  if (typeof document !== "undefined" && "fonts" in document) await document.fonts.ready;
}

export async function canvasPng(canvas: HTMLCanvasElement): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Seu navegador não conseguiu criar a imagem.");
  return blob;
}

type VideoOptions = { canvas: HTMLCanvasElement; durationMs?: number; frameRate?: number; drawFrame: (progress: number) => void };

export async function canvasWebm({ canvas, durationMs = 2400, frameRate = 30, drawFrame }: VideoOptions): Promise<Blob> {
  const mimeType = supportedWebmMime();
  if (!mimeType || typeof canvas.captureStream !== "function") throw new Error("Este navegador não oferece exportação de vídeo WebM. Baixe o PNG em vez disso.");

  const stream = canvas.captureStream(frameRate);
  const chunks: Blob[] = [];
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3_000_000 });
  const done = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    recorder.onerror = () => reject(new Error("Não foi possível gravar este vídeo."));
    recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType }));
  });

  const started = performance.now();
  const render = (now: number) => {
    const progress = Math.min(1, (now - started) / durationMs);
    drawFrame(progress);
    if (progress < 1) requestAnimationFrame(render);
    else recorder.stop();
  };

  try {
    recorder.start();
    requestAnimationFrame(render);
    return await done;
  } finally {
    stream.getTracks().forEach((track) => track.stop());
  }
}
