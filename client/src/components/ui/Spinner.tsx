export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}