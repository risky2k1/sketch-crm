"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, BriefcaseBusiness, LayoutDashboard, NotebookPen, Settings, Users, CheckSquare, FolderKanban } from "lucide-react";

import { WorkspaceSwitcher } from "@/components/workspace/workspace-switcher";
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

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("w-72 shrink-0 border-r border-sidebar-border bg-sidebar", className)}>
      <div className="flex h-full flex-col p-4">
        <WorkspaceSwitcher />

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
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
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-border bg-card p-3">
          <p className="text-xs font-medium">Quick Note</p>
          <p className="mt-1 text-xs text-muted-foreground">Activities and timeline modules come next.</p>
        </div>
      </div>
    </aside>
  );
}
