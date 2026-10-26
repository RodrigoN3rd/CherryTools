import type { CSSProperties } from "react";

type Props = { name: string; label?: string; size?: number; filled?: boolean; className?: string };

export function GoogleSymbol({ name, label, size = 20, filled = false, className }: Props) {
  const style: CSSProperties = { fontSize: `${size}px`, fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' ${Math.min(48, Math.max(20, size))}` };
  return <span className={`google-symbol${className ? ` ${className}` : ""}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} style={style}>{name}</span>;
}
