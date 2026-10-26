"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { createPrompt } from "@/lib/tools/algorithms";
import { CopyAction, DownloadAction, PngDownloadAction } from "./design-actions";

const defaults = { niche: "pôster cultural", style: "editorial tátil", colors: "vinho, rosa suave e creme", goal: "convidar pessoas para uma mostra", difficulty: "intermediário" };

export function PromptStudio() {
  const [input, setInput] = useState(defaults);
  const [seed, setSeed] = useState(0);
  const prompt = useMemo(() => createPrompt(input, seed), [input, seed]);
  const update = (key: keyof typeof input, value: string) => setInput((current) => ({ ...current, [key]: value }));
  return <div className="workspace">
    <section className="panel"><h2>Seu ponto de partida</h2><p className="panel-help">Uma combinação local de restrições para sair da página em branco.</p><div className="field"><label htmlFor="prompt-niche">Nicho</label><input id="prompt-niche" value={input.niche} onChange={(event) => update("niche", event.target.value)} /></div><div className="field"><label htmlFor="prompt-style">Estilo</label><input id="prompt-style" value={input.style} onChange={(event) => update("style", event.target.value)} /></div><div className="field"><label htmlFor="prompt-colors">Cores</label><input id="prompt-colors" value={input.colors} onChange={(event) => update("colors", event.target.value)} /></div><div className="field"><label htmlFor="prompt-goal">Objetivo</label><textarea id="prompt-goal" value={input.goal} onChange={(event) => update("goal", event.target.value)} /></div><div className="field"><label htmlFor="prompt-difficulty">Nível</label><select id="prompt-difficulty" value={input.difficulty} onChange={(event) => update("difficulty", event.target.value)}><option value="iniciante">Iniciante</option><option value="intermediário">Intermediário</option><option value="avançado">Avançado</option></select></div><div className="control-actions"><button className="button button-primary" type="button" onClick={() => setSeed((current) => current + 1)}><RefreshCw size={15} /> Outra direção</button></div></section>
    <section className="panel preview-panel"><article className="prompt-card"><span>Briefing {input.difficulty}</span><p>{prompt}</p></article></section>
    <section className="panel"><h2>Briefing exportável</h2><p className="panel-help">Envie para um caderno, uma equipe ou o seu próprio processo criativo.</p><pre className="code-block">{prompt}</pre><div className="control-actions"><CopyAction value={prompt} label="Copiar briefing" /><DownloadAction filename="cherry-briefing.txt" value={prompt} label="Baixar TXT" /><PngDownloadAction filename="cherry-briefing.png" draw={(context, width, height) => { context.fillStyle = "#FFF8F1"; context.fillRect(0, 0, width, height); context.fillStyle = "#F6DDE2"; context.fillRect(72, 72, width - 144, height - 144); context.fillStyle = "#B83B4B"; context.font = '800 25px "DM Sans", sans-serif'; context.fillText(`BRIEFING ${input.difficulty.toUpperCase()}`, 128, 154); context.fillStyle = "#622E3B"; context.font = 'italic 62px "Instrument Serif", serif'; const words = prompt.split(" "); let line = ""; let y = 260; words.forEach((word) => { const next = `${line}${word} `; if (context.measureText(next).width > width - 260 && line) { context.fillText(line, 128, y); line = `${word} `; y += 78; } else line = next; }); if (line) context.fillText(line, 128, y); context.fillStyle = "#746468"; context.font = '600 22px "DM Sans", sans-serif'; context.fillText("Gerado localmente no Cherry Tools", 128, height - 126); }} /></div></section>
  </div>;
}
