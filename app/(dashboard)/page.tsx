import { ChartNoAxesColumn, CircleCheckBig, Handshake, Users } from "lucide-react";

import { SectionCard } from "@/components/crm/section-card";
import { ModuleHeader } from "@/components/layout/module-header";
import { SketchEmptyState } from "@/components/sketch/sketch-empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "Open Deals", value: "24", hint: "+6 this week", icon: Handshake },
  { label: "Active Contacts", value: "138", hint: "12 recently added", icon: Users },
  { label: "Tasks Due", value: "7", hint: "3 high priority", icon: CircleCheckBig },
  { label: "Win Rate", value: "42%", hint: "Last 30 days", icon: ChartNoAxesColumn },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Dashboard"
        prefix="Workspace"
        rightSlot={
          <span className="rounded-md border border-dashed border-primary/35 bg-primary/10 px-2 py-1 text-xs font-medium">
            Early Access
          </span>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} variant="sketch">
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                <div>
                  <CardDescription>{item.label}</CardDescription>
                  <CardTitle className="mt-2 text-2xl">{item.value}</CardTitle>
                </div>
                <Icon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">{item.hint}</CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="Pipeline Snapshot" description="Current opportunity flow by stage" selected>
            Kanban and list pipeline modules will be connected in the next step.
          </SectionCard>
        </div>
        <SectionCard title="Team Focus" description="Top priorities for this week">
          Task and activity assignments are intentionally placeholder-only for this foundation pass.
        </SectionCard>
      </section>

      <SketchEmptyState />
    </div>
  );
}
