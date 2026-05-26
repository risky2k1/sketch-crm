import Link from "next/link";
import { Building2, ClipboardList, LayoutDashboard, NotebookPen, Settings, Users } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/people", label: "People", icon: Users },
  { href: "/deals", label: "Deals", icon: ClipboardList },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/notes", label: "Notes", icon: NotebookPen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar md:block">
      <div className="flex h-full flex-col p-4">
        <div className="rounded-xl border border-border/80 bg-card px-3 py-2">
          <p className="text-xs text-muted-foreground">Workspace</p>
          <p className="font-medium">Sketch CRM</p>
        </div>
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
