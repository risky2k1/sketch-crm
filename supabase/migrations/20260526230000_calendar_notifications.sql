create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  created_by uuid not null references public.profiles (id),
  title text not null check (char_length(title) between 1 and 200),
  description text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean not null default false,
  timezone text not null default 'Asia/Ho_Chi_Minh',
  color text,
  type text not null default 'general' check (type in ('general', 'birthday', 'task', 'meeting', 'reminder')),
  rrule text,
  recurrence_enabled boolean not null default false,
  recurrence_until timestamptz,
  lunar_enabled boolean not null default false,
  lunar_day int,
  lunar_month int,
  lunar_is_leap_month boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id)
);

create table if not exists public.calendar_event_reminders (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.calendar_events (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  remind_before_minutes int not null check (remind_before_minutes >= 0),
  channels text[] not null default array['in_app']::text[],
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  constraint calendar_event_reminders_unique unique (event_id, remind_before_minutes)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  actor_id uuid references public.profiles (id),
  source_type text not null check (source_type in ('calendar_event', 'task', 'deal', 'system')),
  source_id uuid,
  title text not null,
  body text,
  channels text[] not null default array['in_app']::text[],
  status text not null default 'pending' check (status in ('pending', 'sent', 'read', 'failed')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_calendar_events_workspace_id on public.calendar_events (workspace_id);
create index if not exists idx_calendar_events_starts_at on public.calendar_events (starts_at);
create index if not exists idx_calendar_events_type on public.calendar_events (type);
create index if not exists idx_calendar_event_reminders_event_id on public.calendar_event_reminders (event_id);
create index if not exists idx_calendar_event_reminders_workspace_id on public.calendar_event_reminders (workspace_id);
create index if not exists idx_notifications_workspace_id on public.notifications (workspace_id);
create index if not exists idx_notifications_recipient_status on public.notifications (recipient_id, status);
create index if not exists idx_notifications_scheduled_for on public.notifications (scheduled_for);
create index if not exists idx_notifications_source on public.notifications (source_type, source_id);

create trigger set_calendar_events_updated_at
before update on public.calendar_events
for each row
execute function public.set_updated_at();

alter table public.calendar_events enable row level security;
alter table public.calendar_event_reminders enable row level security;
alter table public.notifications enable row level security;

drop policy if exists calendar_events_select_member on public.calendar_events;
create policy calendar_events_select_member
on public.calendar_events
for select
to authenticated
using (public.is_workspace_member(workspace_id));

drop policy if exists calendar_events_insert_member on public.calendar_events;
create policy calendar_events_insert_member
on public.calendar_events
for insert
to authenticated
with check (
  public.is_workspace_member(workspace_id)
  and created_by = auth.uid()
  and coalesce(updated_by, auth.uid()) = auth.uid()
);

drop policy if exists calendar_events_update_member on public.calendar_events;
create policy calendar_events_update_member
on public.calendar_events
for update
to authenticated
using (public.is_workspace_member(workspace_id))
with check (
  public.is_workspace_member(workspace_id)
  and coalesce(updated_by, auth.uid()) = auth.uid()
);

drop policy if exists calendar_events_delete_member on public.calendar_events;
create policy calendar_events_delete_member
on public.calendar_events
for delete
to authenticated
using (public.is_workspace_member(workspace_id));

drop policy if exists calendar_event_reminders_select_member on public.calendar_event_reminders;
create policy calendar_event_reminders_select_member
on public.calendar_event_reminders
for select
to authenticated
using (public.is_workspace_member(workspace_id));

drop policy if exists calendar_event_reminders_insert_member on public.calendar_event_reminders;
create policy calendar_event_reminders_insert_member
on public.calendar_event_reminders
for insert
to authenticated
with check (public.is_workspace_member(workspace_id));

drop policy if exists calendar_event_reminders_update_member on public.calendar_event_reminders;
create policy calendar_event_reminders_update_member
on public.calendar_event_reminders
for update
to authenticated
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

drop policy if exists calendar_event_reminders_delete_member on public.calendar_event_reminders;
create policy calendar_event_reminders_delete_member
on public.calendar_event_reminders
for delete
to authenticated
using (public.is_workspace_member(workspace_id));

drop policy if exists notifications_select_recipient on public.notifications;
create policy notifications_select_recipient
on public.notifications
for select
to authenticated
using (
  recipient_id = auth.uid()
  and public.is_workspace_member(workspace_id)
);

drop policy if exists notifications_insert_member on public.notifications;
create policy notifications_insert_member
on public.notifications
for insert
to authenticated
with check (public.is_workspace_member(workspace_id));

drop policy if exists notifications_update_recipient on public.notifications;
create policy notifications_update_recipient
on public.notifications
for update
to authenticated
using (
  recipient_id = auth.uid()
  and public.is_workspace_member(workspace_id)
)
with check (
  recipient_id = auth.uid()
  and public.is_workspace_member(workspace_id)
);
