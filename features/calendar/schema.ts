import { z } from "zod";

const reminderSchema = z.object({
  remind_before_minutes: z.number().int().min(0),
  channels: z.array(z.enum(["in_app", "email"]))
    .min(1)
    .default(["in_app"]),
  enabled: z.boolean().default(true),
});

export const calendarEventSchema = z
  .object({
    workspace_id: z.uuid(),
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(5000).optional().nullable(),
    location: z.string().trim().max(240).optional().nullable(),
    starts_at: z.string().datetime(),
    ends_at: z.string().datetime().optional().nullable(),
    all_day: z.boolean().default(false),
    timezone: z.string().min(1).default("Asia/Ho_Chi_Minh"),
    color: z.string().max(32).optional().nullable(),
    type: z.enum(["general", "birthday", "task", "meeting", "reminder"]).default("general"),
    rrule: z.string().max(1000).optional().nullable(),
    recurrence_enabled: z.boolean().default(false),
    recurrence_until: z.string().datetime().optional().nullable(),
    lunar_enabled: z.boolean().default(false),
    lunar_day: z.number().int().min(1).max(30).optional().nullable(),
    lunar_month: z.number().int().min(1).max(12).optional().nullable(),
    lunar_is_leap_month: z.boolean().default(false),
    reminders: z.array(reminderSchema).default([]),
  })
  .superRefine((value, ctx) => {
    if (value.ends_at && new Date(value.ends_at).getTime() < new Date(value.starts_at).getTime()) {
      ctx.addIssue({ code: "custom", message: "End date must be after start date.", path: ["ends_at"] });
    }
    if (value.lunar_enabled && (!value.lunar_day || !value.lunar_month)) {
      ctx.addIssue({ code: "custom", message: "Lunar day and month are required when lunar is enabled." });
    }
  });

export type CalendarEventInput = z.infer<typeof calendarEventSchema>;
