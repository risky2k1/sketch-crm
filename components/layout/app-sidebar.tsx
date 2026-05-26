"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, BriefcaseBusiness, LayoutDashboard, NotebookPen, Settings, Users, CheckSquare, FolderKanban, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";

import { WorkspaceSwitcher } from "@/components/workspace/workspace-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workspaces", label: "Workspaces", icon: FolderKanban },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/people", label: "People", icon: Users },
  { href: "/deals", label: "Deals", icon: BriefcaseBusiness },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/notes", label: "Notes", icon: NotebookPen },
  { href: "/settings", label: "Settings", icon: Settings },
];

type AppSidebarProps = {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  isMobile?: boolean;
};

export function AppSidebar({ className, collapsed = false, onToggleCollapse, onNavigate, isMobile = false }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("shrink-0 border-r border-sidebar-border bg-sidebar transition-[width,transform] duration-300 ease-out", collapsed ? "w-20" : "w-72", className)}>
      <div className="flex h-full flex-col p-4">
        <div className="mb-3 flex items-center justify-between">
          {isMobile ? (
            <p className="text-sm font-semibold">Menu</p>
          ) : (
            <p className={cn("text-sm font-semibold transition-opacity", collapsed && "opacity-0")}>Workspace</p>
          )}
          <Button variant="ghost" size="icon" onClick={isMobile ? onNavigate : onToggleCollapse} aria-label={isMobile ? "Close menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {isMobile ? <X className="size-4" /> : collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
        </div>

        {!collapsed ? <WorkspaceSwitcher /> : null}

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "group relative flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  collapsed ? "justify-center" : "gap-2",
                  isActive
                    ? "border border-primary/30 bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-lg border border-dashed border-primary/35"
                  />
                ) : null}
                <Icon className="relative z-10 size-4" />
                {!collapsed ? <span className="relative z-10">{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        {!collapsed ? (
          <div className="mt-auto rounded-xl border border-border bg-card p-3">
            <p className="text-xs font-medium">Quick Note</p>
            <p className="mt-1 text-xs text-muted-foreground">Activities and timeline modules come next.</p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
