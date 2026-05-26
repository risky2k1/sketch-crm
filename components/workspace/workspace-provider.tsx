"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { Workspace } from "@/features/workspaces/types";

const CURRENT_WORKSPACE_KEY = "sketch_crm_current_workspace_id";

type WorkspaceContextValue = {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspaceId: string) => void;
  isLoading: boolean;
  error: string | null;
  refreshWorkspaces: () => Promise<void>;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children, initialWorkspaces }: { children: React.ReactNode; initialWorkspaces: Workspace[] }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(() => {
    if (typeof window === "undefined") return initialWorkspaces[0]?.id ?? null;
    const stored = localStorage.getItem(CURRENT_WORKSPACE_KEY);
    if (stored && initialWorkspaces.some((workspace) => workspace.id === stored)) return stored;
    return initialWorkspaces[0]?.id ?? null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWorkspaces = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/workspaces", { cache: "no-store" });
      const payload = (await response.json()) as { workspaces?: Workspace[]; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load workspaces.");
      }

      const next = payload.workspaces ?? [];
      setWorkspaces(next);

      if (next.length === 0) {
        setSelectedWorkspaceId(null);
        localStorage.removeItem(CURRENT_WORKSPACE_KEY);
        return;
      }

      const stored = localStorage.getItem(CURRENT_WORKSPACE_KEY);
      const valid = stored && next.some((workspace) => workspace.id === stored) ? stored : next[0].id;
      setSelectedWorkspaceId(valid);
      localStorage.setItem(CURRENT_WORKSPACE_KEY, valid);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Failed to load workspaces.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!selectedWorkspaceId) {
      localStorage.removeItem(CURRENT_WORKSPACE_KEY);
      return;
    }
    localStorage.setItem(CURRENT_WORKSPACE_KEY, selectedWorkspaceId);
  }, [selectedWorkspaceId]);

  const currentWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === selectedWorkspaceId) ?? null,
    [workspaces, selectedWorkspaceId],
  );

  const setCurrentWorkspace = useCallback(
    (workspaceId: string) => {
      if (!workspaces.some((workspace) => workspace.id === workspaceId)) return;
      setSelectedWorkspaceId(workspaceId);
      localStorage.setItem(CURRENT_WORKSPACE_KEY, workspaceId);
    },
    [workspaces],
  );

  const value: WorkspaceContextValue = {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    isLoading,
    error,
    refreshWorkspaces,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider.");
  }
  return context;
}
