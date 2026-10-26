export type Dimensions = { width: number; height: number };
export type PercentCrop = { x: number; y: number; width: number; height: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function fitDimensions(source: Dimensions, target: { width: number | null; height: number | null; keepRatio: boolean }): Dimensions {
  const sourceWidth = Math.max(1, source.width);
  const sourceHeight = Math.max(1, source.height);
  const ratio = sourceWidth / sourceHeight;
  const width = target.width && target.width > 0 ? Math.round(target.width) : null;
  const height = target.height && target.height > 0 ? Math.round(target.height) : null;

  if (!target.keepRatio) return { width: width ?? sourceWidth, height: height ?? sourceHeight };
  if (width) return { width, height: Math.max(1, Math.round(width / ratio)) };
  if (height) return { width: Math.max(1, Math.round(height * ratio)), height };
  return { width: sourceWidth, height: sourceHeight };
}

export function quantizeChannel(value: number, levels: number): number {
  const safeLevels = clamp(Math.round(levels), 2, 256);
  const step = 255 / (safeLevels - 1);
  return Math.round(clamp(value, 0, 255) / step) * step;
}

export function sourceCrop(sourceWidth: number, sourceHeight: number, crop: PercentCrop): Dimensions & { x: number; y: number } {
  const x = clamp(crop.x, 0, 100);
  const y = clamp(crop.y, 0, 100);
  const width = clamp(crop.width, 1, 100 - x);
  const height = clamp(crop.height, 1, 100 - y);
  return {
    x: Math.round((x / 100) * sourceWidth),
    y: Math.round((y / 100) * sourceHeight),
    width: Math.round((width / 100) * sourceWidth),
    height: Math.round((height / 100) * sourceHeight)
  };
}
