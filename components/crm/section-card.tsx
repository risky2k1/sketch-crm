import { ReactNode } from "react";

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="mt-3 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}
