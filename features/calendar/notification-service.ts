import { RRule, rrulestr } from "rrule";

import { lunarToSolar } from "@/lib/lunar-calendar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

import type { CalendarEventInput } from "./schema";

type ReminderInput = CalendarEventInput["reminders"][number];

function getOccurrences(event: CalendarEventInput): Date[] {
  const startDate = new Date(event.starts_at);

  if (event.lunar_enabled && event.lunar_day && event.lunar_month) {
    const now = new Date();
    const thisYear = lunarToSolar(now.getUTCFullYear(), event.lunar_month, event.lunar_day, event.lunar_is_leap_month);
    const nextYear = lunarToSolar(now.getUTCFullYear() + 1, event.lunar_month, event.lunar_day, event.lunar_is_leap_month);
    return [thisYear >= now ? thisYear : nextYear];
  }

  if (!event.recurrence_enabled || !event.rrule) {
    return [startDate];
  }

  const windowStart = new Date();
  const windowEnd = new Date(windowStart);
  windowEnd.setUTCDate(windowEnd.getUTCDate() + 90);

  const rule = rrulestr(event.rrule, { dtstart: startDate }) as RRule;
  return rule.between(windowStart, windowEnd, true);
}

function occurrenceKey(eventId: string, at: Date): string {
  return `${eventId}:${at.toISOString()}`;
}

async function upsertEventReminders(eventId: string, workspaceId: string, reminders: ReminderInput[]) {
  const supabase = await createSupabaseServerClient();

  await supabase.from("calendar_event_reminders").delete().eq("event_id", eventId);

  if (!reminders.length) return;

  const payload = reminders.map((reminder) => ({
    event_id: eventId,
    workspace_id: workspaceId,
    remind_before_minutes: reminder.remind_before_minutes,
    channels: reminder.channels,
    enabled: reminder.enabled,
  }));

  await supabase.from("calendar_event_reminders").insert(payload);
}

export async function regenerateEventNotifications(params: {
  eventId: string;
  actorId: string;
  workspaceId: string;
  event: CalendarEventInput;
}) {
  const { eventId, actorId, workspaceId, event } = params;
  const supabase = await createSupabaseServerClient();

  await upsertEventReminders(eventId, workspaceId, event.reminders);

  await supabase
    .from("notifications")
    .delete()
    .eq("source_type", "calendar_event")
    .eq("source_id", eventId)
    .eq("status", "pending");

  const occurrences = getOccurrences(event);
  if (!event.reminders.length || !occurrences.length) return;

  const notifications: Database["public"]["Tables"]["notifications"]["Insert"][] = [];

  for (const occurrence of occurrences) {
    for (const reminder of event.reminders) {
      if (!reminder.enabled) continue;

      const scheduledFor = new Date(occurrence.getTime() - reminder.remind_before_minutes * 60 * 1000);
      if (scheduledFor.getTime() < Date.now() - 60_000) continue;

      notifications.push({
        workspace_id: workspaceId,
        recipient_id: actorId,
        actor_id: actorId,
        source_type: "calendar_event",
        source_id: eventId,
        title: `Reminder: ${event.title}`,
        body: event.description ?? null,
        channels: reminder.channels,
        status: "pending",
        scheduled_for: scheduledFor.toISOString(),
        metadata: {
          occurrence_key: occurrenceKey(eventId, occurrence),
          remind_before_minutes: reminder.remind_before_minutes,
        },
      });
    }
  }

  if (notifications.length) {
    await supabase.from("notifications").insert(notifications);
  }
}
