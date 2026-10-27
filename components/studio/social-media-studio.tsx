"use client";

import type { ToolDefinition } from "@/lib/tools/catalog";
import { BrandKitStudio, CaptionGeneratorStudio, ContentCalendarStudio, ContentChecklistStudio, ContentIdeasStudio, HashtagOrganizerStudio, LinkInBioStudio, MediaKitStudio, QrCodeStudio, UtmLinkStudio } from "./social-planning-studios";
import { CanvasComposerStudio, CarouselMakerStudio, InstagramGridStudio, SafeZoneStudio, SocialImageResizerStudio, WatermarkStudio } from "./social-visual-studios";

type SocialToolKind = Extract<ToolDefinition["kind"], "carousel" | "social-resizer" | "thumbnail" | "instagram-grid" | "story" | "safe-zone" | "caption" | "hashtags" | "calendar" | "brand-kit" | "link-bio" | "qr-code" | "watermark" | "utm" | "post-mockup" | "text-overlay" | "content-ideas" | "media-kit" | "meme" | "content-checklist">;

export function SocialMediaStudio({ tool }: { tool: ToolDefinition & { kind: SocialToolKind } }) {
  switch (tool.kind) {
    case "carousel": return <CarouselMakerStudio />;
    case "social-resizer": return <SocialImageResizerStudio />;
    case "thumbnail": return <CanvasComposerStudio mode="thumbnail" />;
    case "instagram-grid": return <InstagramGridStudio />;
    case "story": return <CanvasComposerStudio mode="story" />;
    case "safe-zone": return <SafeZoneStudio />;
    case "caption": return <CaptionGeneratorStudio />;
    case "hashtags": return <HashtagOrganizerStudio />;
    case "calendar": return <ContentCalendarStudio />;
    case "brand-kit": return <BrandKitStudio />;
    case "link-bio": return <LinkInBioStudio />;
    case "qr-code": return <QrCodeStudio />;
    case "watermark": return <WatermarkStudio />;
    case "utm": return <UtmLinkStudio />;
    case "post-mockup": return <CanvasComposerStudio mode="post-mockup" />;
    case "text-overlay": return <CanvasComposerStudio mode="text-overlay" />;
    case "content-ideas": return <ContentIdeasStudio />;
    case "media-kit": return <MediaKitStudio />;
    case "meme": return <CanvasComposerStudio mode="meme" />;
    case "content-checklist": return <ContentChecklistStudio />;
  }
}
