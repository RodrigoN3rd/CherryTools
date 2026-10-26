"use client";

import type { ToolDefinition } from "@/lib/tools/catalog";
import { ColorStudio } from "./studio/color-studio";

const colorKinds = new Set(["palette", "extractor", "gradient", "contrast", "harmony"]);

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  if (colorKinds.has(tool.kind)) return <ColorStudio tool={tool as never} />;
  return <div className="panel"><h2>Este estúdio está sendo preparado.</h2><p className="panel-help">A rota e as informações já existem; os controles funcionais entram na próxima etapa de implementação.</p></div>;
}
