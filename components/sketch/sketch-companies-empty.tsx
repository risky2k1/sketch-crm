import Link from "next/link";
import { Building2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SketchCompaniesEmpty() {
  return (
    <Card variant="sketch" className="relative overflow-hidden border-primary/30 sketch-surface">
      <span aria-hidden className="pointer-events-none absolute -right-3 top-3 h-8 w-14 rotate-6 rounded bg-primary/20" />
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sketch Accent</p>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="size-5" />
          No companies yet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Create your first company to start tracking accounts, people, and opportunities.
        </p>
        <Link href="/companies/new" className={buttonVariants({ variant: "sketch" })}>
          Create company
        </Link>
      </CardContent>
    </Card>
  );
}
