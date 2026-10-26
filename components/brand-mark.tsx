export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand" aria-label="Cherry Tools">
      <span className="brand-mark" aria-hidden="true"><span>c</span></span>
      {!compact && <span>cherry tools</span>}
    </span>
  );
}
