export function Progress({ value }: { value: number }) {
  return (
    <div className="progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} role="progressbar">
      <div style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
