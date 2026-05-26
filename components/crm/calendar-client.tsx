"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import type { DateSelectArg, EventApi, EventClickArg, EventDropArg, EventInput } from "@fullcalendar/core";

import { formatLunarShort } from "@/lib/lunar-calendar";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CalendarFormState = {
  id?: string;
  title: string;
  description: string;
  location: string;
  starts_at: string;
  ends_at: string;
  all_day: boolean;
  type: "general" | "birthday" | "task" | "meeting" | "reminder";
  recurrence_enabled: boolean;
  rrule: string;
  lunar_enabled: boolean;
  lunar_day: string;
  lunar_month: string;
  reminders: string;
};

const defaultForm: CalendarFormState = {
  title: "",
  description: "",
  location: "",
  starts_at: "",
  ends_at: "",
  all_day: false,
  type: "general",
  recurrence_enabled: false,
  rrule: "",
  lunar_enabled: false,
  lunar_day: "",
  lunar_month: "",
  reminders: "10,60",
};

function toDatetimeLocal(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function fromDatetimeLocal(value: string) {
  return new Date(value).toISOString();
}

export function CalendarClient() {
  const { currentWorkspace } = useWorkspace();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CalendarFormState>(defaultForm);
  const [error, setError] = useState<string | null>(null);

  const workspaceId = currentWorkspace?.id;

  const loadEvents = useCallback(async () => {
    if (!workspaceId) return;
    const res = await fetch(`/api/calendar/events?workspaceId=${workspaceId}`, { cache: "no-store" });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error ?? "Failed to load events.");
      return;
    }
    setEvents((payload.events ?? []).map((item: Record<string, unknown>) => ({
      id: String(item.id),
      title: String(item.title),
      start: String(item.starts_at),
      end: item.ends_at ? String(item.ends_at) : undefined,
      allDay: Boolean(item.all_day),
      color: (item.color as string | null) ?? undefined,
      rrule: item.rrule ?? undefined,
      extendedProps: item,
    })));
    setError(null);
  }, [workspaceId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEvents();
  }, [loadEvents]);

  const openCreate = useCallback((selection: DateSelectArg) => {
    setForm({
      ...defaultForm,
      starts_at: toDatetimeLocal(selection.start.toISOString()),
      ends_at: toDatetimeLocal(selection.end?.toISOString()),
      all_day: selection.allDay,
    });
    setOpen(true);
  }, []);

  const openEdit = useCallback((eventApi: EventApi) => {
    const ext = eventApi.extendedProps as Record<string, unknown>;
    setForm({
      id: eventApi.id,
      title: eventApi.title,
      description: String(ext.description ?? ""),
      location: String(ext.location ?? ""),
      starts_at: toDatetimeLocal(String(ext.starts_at ?? eventApi.start?.toISOString() ?? "")),
      ends_at: toDatetimeLocal(String(ext.ends_at ?? eventApi.end?.toISOString() ?? "")),
      all_day: Boolean(ext.all_day ?? eventApi.allDay),
      type: (ext.type as CalendarFormState["type"]) ?? "general",
      recurrence_enabled: Boolean(ext.recurrence_enabled),
      rrule: String(ext.rrule ?? ""),
      lunar_enabled: Boolean(ext.lunar_enabled),
      lunar_day: ext.lunar_day ? String(ext.lunar_day) : "",
      lunar_month: ext.lunar_month ? String(ext.lunar_month) : "",
      reminders: Array.isArray(ext.calendar_event_reminders)
        ? (ext.calendar_event_reminders as Array<{ remind_before_minutes: number }>).map((x) => x.remind_before_minutes).join(",")
        : "10,60",
    });
    setOpen(true);
  }, []);

  const onQuickMove = useCallback(
    async (eventId: string, start: Date | null, end: Date | null, allDay: boolean) => {
      if (!workspaceId || !start) return;
      const target = events.find((event) => event.id === eventId);
      if (!target) return;
      const ext = (target.extendedProps as Record<string, unknown>) ?? {};
      await fetch(`/api/calendar/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace_id: workspaceId,
          title: String(target.title ?? ext.title ?? "Untitled"),
          description: (ext.description as string | null) ?? null,
          location: (ext.location as string | null) ?? null,
          starts_at: start.toISOString(),
          ends_at: end?.toISOString() ?? null,
          all_day: allDay,
          timezone: "Asia/Ho_Chi_Minh",
          color: (target.color as string | null) ?? null,
          type: (ext.type as string) ?? "general",
          rrule: (ext.rrule as string | null) ?? null,
          recurrence_enabled: Boolean(ext.recurrence_enabled),
          recurrence_until: (ext.recurrence_until as string | null) ?? null,
          lunar_enabled: Boolean(ext.lunar_enabled),
          lunar_day: (ext.lunar_day as number | null) ?? null,
          lunar_month: (ext.lunar_month as number | null) ?? null,
          lunar_is_leap_month: Boolean(ext.lunar_is_leap_month),
          reminders: Array.isArray(ext.calendar_event_reminders)
            ? (ext.calendar_event_reminders as Array<{ remind_before_minutes: number; channels?: string[]; enabled?: boolean }>).map((x) => ({
                remind_before_minutes: x.remind_before_minutes,
                channels: x.channels ?? ["in_app"],
                enabled: x.enabled ?? true,
              }))
            : [{ remind_before_minutes: 10, channels: ["in_app"], enabled: true }],
        }),
      });
      await loadEvents();
    },
    [events, loadEvents, workspaceId],
  );

  const submit = useCallback(async () => {
    if (!workspaceId) return;
    const reminderMinutes = form.reminders
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value) && value >= 0);

    const payload = {
      workspace_id: workspaceId,
      title: form.title,
      description: form.description || null,
      location: form.location || null,
      starts_at: fromDatetimeLocal(form.starts_at),
      ends_at: form.ends_at ? fromDatetimeLocal(form.ends_at) : null,
      all_day: form.all_day,
      timezone: "Asia/Ho_Chi_Minh",
      type: form.type,
      color: null,
      recurrence_enabled: form.recurrence_enabled,
      rrule: form.recurrence_enabled ? form.rrule || null : null,
      recurrence_until: null,
      lunar_enabled: form.lunar_enabled,
      lunar_day: form.lunar_enabled ? Number(form.lunar_day) : null,
      lunar_month: form.lunar_enabled ? Number(form.lunar_month) : null,
      lunar_is_leap_month: false,
      reminders: reminderMinutes.map((minutes) => ({ remind_before_minutes: minutes, channels: ["in_app"], enabled: true })),
    };

    const url = form.id ? `/api/calendar/events/${form.id}` : "/api/calendar/events";
    const method = form.id ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const resPayload = await res.json();
    if (!res.ok) {
      setError(resPayload.error ?? "Failed to save event.");
      return;
    }

    setOpen(false);
    setForm(defaultForm);
    await loadEvents();
  }, [form, loadEvents, workspaceId]);

  const remove = useCallback(async () => {
    if (!form.id) return;
    await fetch(`/api/calendar/events/${form.id}`, { method: "DELETE" });
    setOpen(false);
    setForm(defaultForm);
    await loadEvents();
  }, [form.id, loadEvents]);

  const title = useMemo(() => currentWorkspace?.name ?? "Calendar", [currentWorkspace?.name]);

  return (
    <div className="space-y-4">
      <section className="sketch-card rounded-xl p-5">
        <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
        <p className="mt-1 text-sm text-muted-foreground">{title} • month / week / day / list views with reminders.</p>
      </section>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <section className="sketch-card crm-calendar overflow-hidden rounded-xl p-3">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, rrulePlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          events={events}
          editable
          selectable
          selectMirror
          dayMaxEvents
          select={openCreate}
          eventClick={(arg: EventClickArg) => openEdit(arg.event)}
          eventDrop={(arg: EventDropArg) => onQuickMove(arg.event.id, arg.event.start, arg.event.end, arg.event.allDay)}
          eventResize={(arg) => onQuickMove(arg.event.id, arg.event.start, arg.event.end, arg.event.allDay)}
          dayCellContent={(arg) => (
            <div className="flex flex-col">
              <span>{arg.dayNumberText.replace("日", "")}</span>
              <span className="text-[10px] text-muted-foreground/70">{formatLunarShort(arg.date)}</span>
            </div>
          )}
          noEventsContent={() => (
            <div className="my-6 rounded-lg border border-dashed border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">No events yet</p>
              <p className="mt-1">Start by adding your first reminder or meeting.</p>
            </div>
          )}
          height="auto"
        />
      </section>

      {open ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/25 p-4">
          <div className="sketch-card w-full max-w-lg rounded-xl bg-background p-4 shadow-xl">
            <h2 className="text-lg font-semibold">{form.id ? "Edit Event" : "New Event"}</h2>
            <div className="mt-3 grid gap-3">
              <Input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="Title" />
              <Textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} placeholder="Description" />
              <Input value={form.location} onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))} placeholder="Location" />
              <div className="grid grid-cols-2 gap-2">
                <Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm((s) => ({ ...s, starts_at: e.target.value }))} />
                <Input type="datetime-local" value={form.ends_at} onChange={(e) => setForm((s) => ({ ...s, ends_at: e.target.value }))} />
              </div>
              <Input value={form.reminders} onChange={(e) => setForm((s) => ({ ...s, reminders: e.target.value }))} placeholder="Reminder minutes: 10,60,1440" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="sketch" onClick={submit}>{form.id ? "Update" : "Create"}</Button>
              {form.id ? <Button variant="destructive" onClick={remove}>Delete</Button> : null}
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
