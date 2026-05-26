"use client";

import Link from "next/link";

import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function WorkspaceSwitcher() {
  const { workspaces, currentWorkspace, setCurrentWorkspace, isLoading } = useWorkspace();

  return (
    <div className="rounded-xl border border-border/80 bg-card px-3 py-3 shadow-xs">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold">{currentWorkspace?.name ?? "No workspace"}</p>
        <Badge variant="secondary">MVP</Badge>
      </div>

      {workspaces.length > 0 ? (
        <select
          className="mt-2 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          value={currentWorkspace?.id ?? ""}
          onChange={(event) => setCurrentWorkspace(event.target.value)}
          disabled={isLoading}
          aria-label="Select workspace"
        >
          {workspaces.map((workspace) => (
            <option key={workspace.id} value={workspace.id}>
              {workspace.name}
            </option>
          ))}
        </select>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">You don&apos;t have any workspaces yet.</p>
      )}

      <div className="mt-3 flex gap-2">
        <Link href="/workspaces/new" className={buttonVariants({ size: "sm" })}>
          Create workspace
        </Link>
        <Link href="/settings/workspace" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Members
        </Link>
      </div>
    </div>
  );
}
