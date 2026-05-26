import Link from "next/link";
import { Building2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SketchCompaniesEmpty() {
  return (
    <Card className="relative overflow-hidden border-primary/30">
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl border border-dashed border-primary/35" />
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
        <Link href="/companies/new" className={buttonVariants()}>
          Create company
        </Link>
      </CardContent>
    </Card>
  );
}
