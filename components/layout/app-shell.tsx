"use client";

import { ReactNode, useState } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { WorkspaceProvider } from "@/components/workspace/workspace-provider";
import type { Workspace } from "@/features/workspaces/types";

export function AppShell({ children, initialWorkspaces }: { children: ReactNode; initialWorkspaces: Workspace[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  return (
    <WorkspaceProvider initialWorkspaces={initialWorkspaces}>
      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen">
          <AppSidebar
            className="hidden md:block"
            collapsed={desktopCollapsed}
            onToggleCollapse={() => setDesktopCollapsed((prev) => !prev)}
          />

          <button
            className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-300 ease-out md:hidden ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu overlay"
          />
          <AppSidebar
            className={`fixed inset-y-0 left-0 z-40 md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
            isMobile
            onNavigate={() => setMobileOpen(false)}
          />

          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar onMenuClick={() => setMobileOpen(true)} />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </div>
      </div>
    </WorkspaceProvider>
  );
}
