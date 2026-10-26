import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools/catalog";
import { ToolIcon } from "./tool-icon";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link className="tool-card" href={`/tools/${tool.slug}`} aria-label={`Abrir ${tool.name}`}>
      <div className="tool-card__top">
        <span className="tool-card__icon"><ToolIcon name={tool.icon} /></span>
        <ArrowUpRight className="tool-card__arrow" size={18} aria-hidden="true" />
      </div>
      <div>
        <span className="tool-card__eyebrow">{tool.eyebrow}</span>
        <h3>{tool.name}</h3>
        <p>{tool.description}</p>
      </div>
    </Link>
  );
}
