import Link from "next/link";

import { ModuleHeader } from "@/components/layout/module-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserWorkspaces } from "@/lib/supabase/workspaces";

export default async function WorkspacesPage() {
  const workspaces = await getUserWorkspaces();

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Workspaces"
        prefix="Workspace"
        rightSlot={
          <Link href="/workspaces/new" className={buttonVariants({ variant: "sketch", size: "sm" })}>
            Create workspace
          </Link>
        }
      />

      {workspaces.length === 0 ? (
        <Card variant="sketch" className="relative overflow-hidden border-primary/30 sketch-surface">
          <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl border border-dashed border-primary/35" />
          <CardHeader>
            <CardTitle>No workspace yet</CardTitle>
            <CardDescription>Create your first workspace to start using Sketch CRM modules.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/workspaces/new" className={buttonVariants({ variant: "sketch", size: "sm" })}>
              Create workspace
            </Link>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-3">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} variant="sketch">
              <CardHeader>
                <CardTitle>{workspace.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Slug: {workspace.slug ?? "(generated)"}</p>
                <p>Workspace ID: {workspace.id}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
