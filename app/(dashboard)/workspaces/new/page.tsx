import { CreateWorkspaceForm } from "@/components/workspace/create-workspace-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewWorkspacePage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <section>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workspace Module</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Create Workspace</h1>
        <p className="mt-1 text-sm text-muted-foreground">A new workspace is created with you as the owner.</p>
      </section>

      <Card>
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
