import {
  ArrowUpRight, Blend, CircleDot, Contrast, Crop, Pipette, FileDown, Frame, Grid2X2, LayoutTemplate,
  Layers, ListTree, Maximize, Palette, PanelsTopLeft, Repeat2, Shapes, Sparkles, Spline, TextCursorInput, Type
} from "lucide-react";

const icons = { ArrowUpRight, Palette, Eyedropper: Pipette, Blend, Contrast, CircleDot, Maximize, FileDown, Repeat2, Crop, Grid2X2, Type, ListTree, TextCursorInput, Layers, Squircle: Spline, Shapes, LayoutTemplate, PanelsTopLeft, Sparkles, Frames: Frame };

export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons] ?? Palette;
  return <Icon aria-hidden="true" className={className} strokeWidth={1.7} />;
}
