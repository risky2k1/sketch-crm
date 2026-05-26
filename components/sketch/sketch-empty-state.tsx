import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SketchEmptyState() {
  return (
    <Card className="relative overflow-hidden border-primary/30">
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl border border-dashed border-primary/35" />
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sketch Accent</p>
        <CardTitle>Nothing in your timeline yet</CardTitle>
        <CardDescription>
          Activity, notes, and task updates will appear here once your team starts creating records.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <Button size="sm">
          <Plus className="size-4" />
          Add Company
        </Button>
        <Button size="sm" variant="outline">
          View Sample Data
        </Button>
      </CardContent>
    </Card>
  );
}
