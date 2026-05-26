import { SectionCard } from "@/components/crm/section-card";
import { SketchEmptyState } from "@/components/sketch/sketch-empty-state";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Modern CRM foundation with subtle sketch accents.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Companies">List and manage organization records.</SectionCard>
        <SectionCard title="People">Track contacts and relationships.</SectionCard>
        <SectionCard title="Deals">Visualize opportunities and pipeline status.</SectionCard>
      </div>

      <SketchEmptyState />
    </div>
  );
}
