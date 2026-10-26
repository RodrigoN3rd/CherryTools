"use client";

import type { ToolDefinition } from "@/lib/tools/catalog";
import { ColorStudio } from "./studio/color-studio";
import { ImageStudio } from "./studio/image-studio";

const colorKinds = new Set(["palette", "extractor", "gradient", "contrast", "harmony"]);
const imageKinds = new Set(["resize", "compress", "convert", "crop", "pixel"]);

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  if (colorKinds.has(tool.kind)) return <ColorStudio tool={tool as never} />;
  if (imageKinds.has(tool.kind)) return <ImageStudio tool={tool as never} />;
  return <div className="panel"><h2>Este estúdio está sendo preparado.</h2><p className="panel-help">A rota e as informações já existem; os controles funcionais entram na próxima etapa de implementação.</p></div>;
}
