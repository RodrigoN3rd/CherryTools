export type SocialFormatPreset = {
  id: string;
  label: string;
  platform: string;
  width: number;
  height: number;
  use: string;
};

/**
 * Centralized, version-controlled presets. Platform changes are made here rather
 * than being hidden in a canvas component.
 */
export const socialFormats = {
  instagramSquare: { id: "instagramSquare", label: "Post quadrado", platform: "Instagram", width: 1080, height: 1080, use: "Feed" },
  instagramPortrait: { id: "instagramPortrait", label: "Post vertical", platform: "Instagram", width: 1080, height: 1350, use: "Feed" },
  instagramStory: { id: "instagramStory", label: "Story e Reels", platform: "Instagram", width: 1080, height: 1920, use: "Story" },
  tiktokVideo: { id: "tiktokVideo", label: "Vídeo vertical", platform: "TikTok", width: 1080, height: 1920, use: "Vídeo" },
  youtubeThumbnail: { id: "youtubeThumbnail", label: "Thumbnail", platform: "YouTube", width: 1280, height: 720, use: "Vídeo" },
  youtubeShort: { id: "youtubeShort", label: "Short", platform: "YouTube", width: 1080, height: 1920, use: "Short" },
  pinterestPin: { id: "pinterestPin", label: "Pin vertical", platform: "Pinterest", width: 1000, height: 1500, use: "Pin" },
  facebookLandscape: { id: "facebookLandscape", label: "Post horizontal", platform: "Facebook", width: 1200, height: 630, use: "Feed" },
  linkedinLandscape: { id: "linkedinLandscape", label: "Post horizontal", platform: "LinkedIn", width: 1200, height: 627, use: "Feed" }
} as const satisfies Record<string, SocialFormatPreset>;

export type SocialFormatId = keyof typeof socialFormats;

export const socialFormatList = Object.values(socialFormats);

export type SafeZonePreset = {
  id: string;
  label: string;
  format: SocialFormatPreset;
  safe: { top: number; right: number; bottom: number; left: number };
  sourceNote: string;
};

export const safeZonePresets: SafeZonePreset[] = [
  { id: "reels", label: "Reels", format: socialFormats.instagramStory, safe: { top: 250, right: 120, bottom: 340, left: 120 }, sourceNote: "Guia configurável: confira o app antes de publicar." },
  { id: "tiktok", label: "TikTok", format: socialFormats.tiktokVideo, safe: { top: 170, right: 160, bottom: 330, left: 80 }, sourceNote: "Guia configurável: confira o app antes de publicar." },
  { id: "shorts", label: "YouTube Shorts", format: socialFormats.youtubeShort, safe: { top: 190, right: 115, bottom: 300, left: 115 }, sourceNote: "Guia configurável: confira o app antes de publicar." },
  { id: "stories", label: "Stories", format: socialFormats.instagramStory, safe: { top: 250, right: 80, bottom: 250, left: 80 }, sourceNote: "Guia configurável: confira o app antes de publicar." }
];
