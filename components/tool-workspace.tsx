"use client";

import type { ToolDefinition } from "@/lib/tools/catalog";
import { ColorStudio } from "./studio/color-studio";
import { ImageStudio } from "./studio/image-studio";
import { CreativeStudio } from "./studio/creative-studio";
import { TypographyStudio } from "./studio/typography-studio";
import { TypeLabStudio } from "./studio/type-lab-studio";
import { KineticTypeStudio } from "./studio/kinetic-type-studio";
import { WebLabStudio } from "./studio/web-lab-studio";
import { OrganicBackgroundStudio } from "./studio/organic-background-studio";
import { WebStudio } from "./studio/web-studio";

const colorKinds = new Set(["palette", "extractor", "gradient", "contrast", "harmony"]);
const imageKinds = new Set(["resize", "compress", "convert", "crop", "pixel"]);
const typeKinds = new Set(["font-pairing", "type-scale", "text-shadow"]);
const typeLabKinds = new Set(["google-font-explorer", "variable-font-axis", "typographic-poster", "text-outline", "monogram", "text-path", "quote-card"]);
const kineticTypeKinds = new Set(["kinetic-type"]);
const webKinds = new Set(["box-shadow", "radius", "svg", "pattern"]);
const webLabKinds = new Set(["layout-grid", "button-studio", "glass-surface", "mesh-gradient", "hero-composer", "device-mockup"]);
const organicBackgroundKinds = new Set(["organic-background"]);
const creativeKinds = new Set(["moodboard", "prompt", "social"]);

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  if (colorKinds.has(tool.kind)) return <ColorStudio tool={tool as never} />;
  if (imageKinds.has(tool.kind)) return <ImageStudio tool={tool as never} />;
  if (typeKinds.has(tool.kind)) return <TypographyStudio tool={tool as never} />;
  if (typeLabKinds.has(tool.kind)) return <TypeLabStudio tool={tool as never} />;
  if (kineticTypeKinds.has(tool.kind)) return <KineticTypeStudio tool={tool as never} />;
  if (webKinds.has(tool.kind)) return <WebStudio tool={tool as never} />;
  if (webLabKinds.has(tool.kind)) return <WebLabStudio tool={tool as never} />;
  if (organicBackgroundKinds.has(tool.kind)) return <OrganicBackgroundStudio tool={tool as never} />;
  if (creativeKinds.has(tool.kind)) return <CreativeStudio tool={tool as never} />;
  return <div className="panel"><h2>Este estúdio está sendo preparado.</h2><p className="panel-help">A rota e as informações já existem; os controles funcionais entram na próxima etapa de implementação.</p></div>;
}
