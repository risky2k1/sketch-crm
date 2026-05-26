import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ModuleHeaderProps = {
  title: string;
  workspaceName?: string;
  prefix?: string;
  rightSlot?: ReactNode;
  className?: string;
};

export function ModuleHeader({ title, workspaceName, prefix, rightSlot, className }: ModuleHeaderProps) {
  return (
    <section className={cn("sketch-card rounded-xl px-4 py-2.5", className)}>
      <div className="flex min-h-8 items-center justify-between gap-3">
        <p className="truncate text-sm text-muted-foreground">
          {workspaceName ? <span className="text-foreground">{workspaceName}</span> : null}
          {workspaceName ? <span className="px-1.5 text-muted-foreground/70">/</span> : null}
          {prefix ? <span>{prefix}</span> : null}
          {prefix ? <span className="px-1.5 text-muted-foreground/70">/</span> : null}
          <span>{title}</span>
        </p>
        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>
    </section>
  );
}
