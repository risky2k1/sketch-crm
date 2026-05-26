import { Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
          <Search className="size-4" />
          <span>Search (coming soon)</span>
        </div>
        <button className="rounded-md border border-border bg-card px-3 py-2 text-sm">User Menu</button>
      </div>
    </header>
  );
}
