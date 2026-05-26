export type CalendarReminder = {
  id: string;
  event_id: string;
  workspace_id: string;
  remind_before_minutes: number;
  channels: string[];
  enabled: boolean;
  created_at: string;
};

export type CalendarEvent = {
  id: string;
  workspace_id: string;
  created_by: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  all_day: boolean;
  timezone: string;
  color: string | null;
  type: "general" | "birthday" | "task" | "meeting" | "reminder";
  rrule: string | null;
  recurrence_enabled: boolean;
  recurrence_until: string | null;
  lunar_enabled: boolean;
  lunar_day: number | null;
  lunar_month: number | null;
  lunar_is_leap_month: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  reminders?: CalendarReminder[];
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string | null;
  status: "pending" | "sent" | "read" | "failed";
  created_at: string;
};
