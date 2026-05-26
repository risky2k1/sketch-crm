"use client";

import { useEffect, useState } from "react";

import { useWorkspace } from "@/components/workspace/workspace-provider";
import type { WorkspaceMember } from "@/features/workspaces/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(dateValue));
}

export function WorkspaceMembersPanel() {
  const { currentWorkspace } = useWorkspace();
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMembers() {
      if (!currentWorkspace) {
        setMembers([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/workspaces/${currentWorkspace.id}/members`, { cache: "no-store" });
        const payload = (await response.json()) as { members?: WorkspaceMember[]; error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to load members.");
        }

        setMembers(payload.members ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load members.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadMembers();
  }, [currentWorkspace]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace members</CardTitle>
      </CardHeader>
      <CardContent>
        {!currentWorkspace ? <p className="text-sm text-muted-foreground">Select or create a workspace first.</p> : null}
        {isLoading ? <p className="text-sm text-muted-foreground">Loading members...</p> : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {currentWorkspace && !isLoading && !error ? (
          members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members found.</p>
          ) : (
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{member.profile?.full_name || member.profile?.email || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{member.profile?.email ?? member.user_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{member.role}</p>
                    <p className="text-xs text-muted-foreground">Joined {formatDate(member.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : null}
      </CardContent>
    </Card>
  );
}
