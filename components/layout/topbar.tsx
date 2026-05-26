"use client";

import { Bell, Command, LogOut, Search } from "lucide-react";

import { logoutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="md:hidden" onClick={onMenuClick}>
          Menu
        </Button>

        <div className="hidden max-w-md flex-1 items-center gap-2 md:flex">
          <div className="relative w-full">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input className="pl-9" placeholder="Search people, deals, tasks..." />
          </div>
          <Button variant="outline" size="sm" className="gap-1 text-xs text-muted-foreground">
            <Command className="size-3.5" />K
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
          <Button size="sm" className="hidden sm:inline-flex">New Record</Button>
          <form action={logoutAction}>
            <Button variant="outline" size="sm" type="submit">
              <LogOut className="size-4" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
