import { WorkspaceMembersPanel } from "@/components/workspace/workspace-members-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceSettingsSummary } from "@/components/workspace/workspace-settings-summary";

export default function WorkspaceSettingsPage() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Settings</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Workspace Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Basic identity and membership for your selected workspace.</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <WorkspaceSettingsSummary />
        </CardContent>
      </Card>

      <WorkspaceMembersPanel />
    </div>
  );
}
