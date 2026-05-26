import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserWorkspaces } from "@/lib/supabase/workspaces";

export default async function WorkspacesPage() {
  const workspaces = await getUserWorkspaces();

  return (
    <div className="space-y-6">
      <section className="flex items-end justify-between gap-3 rounded-xl border border-border bg-card p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workspace Module</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Workspaces</h1>
          <p className="mt-1 text-sm text-muted-foreground">View and manage your available workspaces.</p>
        </div>
        <Link href="/workspaces/new" className={buttonVariants()}>
          Create workspace
        </Link>
      </section>

      {workspaces.length === 0 ? (
        <Card className="relative overflow-hidden border-primary/30">
          <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl border border-dashed border-primary/35" />
          <CardHeader>
            <CardTitle>No workspace yet</CardTitle>
            <CardDescription>Create your first workspace to start using Sketch CRM modules.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/workspaces/new" className={buttonVariants({ size: "sm" })}>
              Create workspace
            </Link>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-3">
          {workspaces.map((workspace) => (
            <Card key={workspace.id}>
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
