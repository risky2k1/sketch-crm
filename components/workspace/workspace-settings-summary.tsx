"use client";

import { useWorkspace } from "@/components/workspace/workspace-provider";

export function WorkspaceSettingsSummary() {
  const { currentWorkspace } = useWorkspace();

  if (!currentWorkspace) {
    return <p className="text-sm text-muted-foreground">No workspace selected. Create a workspace to continue.</p>;
  }

  return (
    <div className="space-y-1 text-sm">
      <p>
        <span className="font-medium">Name:</span> {currentWorkspace.name}
      </p>
      <p>
        <span className="font-medium">Slug:</span> {currentWorkspace.slug ?? "(generated)"}
      </p>
      <p>
        <span className="font-medium">ID:</span> {currentWorkspace.id}
      </p>
    </div>
  );
}
