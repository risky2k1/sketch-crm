-- Grant CRUD privileges for newly added calendar and notifications tables.
-- RLS policies continue to enforce workspace-level isolation.

grant select, insert, update, delete on table public.calendar_events to authenticated;
grant select, insert, update, delete on table public.calendar_event_reminders to authenticated;
grant select, insert, update, delete on table public.notifications to authenticated;
