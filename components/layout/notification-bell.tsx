"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell } from "lucide-react";

import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Button } from "@/components/ui/button";
import type { NotificationItem } from "@/features/calendar/types";

export function NotificationBell() {
  const { currentWorkspace } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    if (!currentWorkspace?.id) return;
    const res = await fetch(`/api/notifications?workspaceId=${currentWorkspace.id}`, { cache: "no-store" });
    if (!res.ok) return;
    const payload = await res.json();
    setItems(payload.items ?? []);
    setUnreadCount(payload.unreadCount ?? 0);
  }, [currentWorkspace]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    await load();
  }

  return (
    <div className="relative">
      <Button variant="outline" size="icon" aria-label="Notifications" onClick={() => setOpen((v) => !v)}>
        <Bell className="size-4" />
      </Button>
      {unreadCount > 0 ? (
        <span className="absolute -top-1 -right-1 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{unreadCount}</span>
      ) : null}

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-80 rounded-lg border border-border bg-card p-2 shadow-lg">
          <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Notifications</p>
          <div className="max-h-80 overflow-auto">
            {items.length === 0 ? <p className="px-2 py-4 text-sm text-muted-foreground">No notifications</p> : null}
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="w-full rounded-md px-2 py-2 text-left hover:bg-accent"
                onClick={() => markRead(item.id)}
              >
                <p className="text-sm font-medium">{item.title}</p>
                {item.body ? <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.body}</p> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
