import { ReactNode } from "react";

export function SketchBorder({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-xl border border-border bg-card p-4">
      <div className="pointer-events-none absolute -inset-0.5 rounded-xl border-2 border-dashed border-primary/40" />
      <div className="relative">{children}</div>
    </div>
  );
}
