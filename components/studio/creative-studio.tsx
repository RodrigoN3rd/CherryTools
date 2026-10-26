"use client";

import type { ToolDefinition } from "@/lib/tools/catalog";
import { MoodboardStudio } from "./moodboard-studio";
import { PromptStudio } from "./prompt-studio";
import { SocialStudio } from "./social-studio";

type CreativeToolKind = Extract<ToolDefinition["kind"], "moodboard" | "prompt" | "social">;

export function CreativeStudio({ tool }: { tool: ToolDefinition & { kind: CreativeToolKind } }) {
  if (tool.kind === "moodboard") return <MoodboardStudio />;
  if (tool.kind === "prompt") return <PromptStudio />;
  return <SocialStudio />;
}
