import { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  children,
  selected,
}: {
  title: string;
  description: string;
  children: ReactNode;
  selected?: boolean;
}) {
  return (
    <Card className={cn("relative", selected ? "border-primary/40 bg-primary/5" : "") }>
      {selected ? (
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl border border-dashed border-primary/35" />
      ) : null}
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{children}</CardContent>
    </Card>
  );
}
