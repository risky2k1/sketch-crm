import { ModuleHeader } from "@/components/layout/module-header";
import { WorkspaceMembersPanel } from "@/components/workspace/workspace-members-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceSettingsSummary } from "@/components/workspace/workspace-settings-summary";

export default function WorkspaceSettingsPage() {
  return (
    <div className="space-y-6">
      <ModuleHeader title="Workspace Settings" prefix="Settings" />

      <Card variant="sketch">
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
