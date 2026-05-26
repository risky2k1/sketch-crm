import { CreateWorkspaceForm } from "@/components/workspace/create-workspace-form";
import { ModuleHeader } from "@/components/layout/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewWorkspacePage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <ModuleHeader title="Create Workspace" prefix="Workspace" />

      <Card variant="sketch">
        <CardHeader>
          <CardTitle>Workspace details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateWorkspaceForm />
        </CardContent>
      </Card>
    </div>
  );
}
