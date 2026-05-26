-- Initial auth + workspace foundation for Sketch CRM MVP.
-- Tables included in this migration:
--   1) profiles
--   2) workspaces
--   3) workspace_members
--
-- Design goals:
-- - Multi-workspace model from day one
-- - RLS enabled on all workspace-scoped tables
-- - Authenticated users can only read/update workspaces they are members of
-- - No service-role usage required in app client code

create extension if not exists pgcrypto;

-- Shared trigger: keep updated_at consistent.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles are synced with auth.users.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Workspaces are core tenancy boundary.
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references public.profiles (id),
  updated_by uuid not null references public.profiles (id)
);

create index if not exists idx_workspaces_created_by on public.workspaces (created_by);
create index if not exists idx_workspaces_created_at on public.workspaces (created_at);

create trigger set_workspaces_updated_at
before update on public.workspaces
for each row
execute function public.set_updated_at();

-- Workspace membership + role.
create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references public.profiles (id),
  updated_by uuid not null references public.profiles (id),
  constraint workspace_members_workspace_user_unique unique (workspace_id, user_id)
);

create index if not exists idx_workspace_members_workspace_id on public.workspace_members (workspace_id);
create index if not exists idx_workspace_members_user_id on public.workspace_members (user_id);
create index if not exists idx_workspace_members_created_at on public.workspace_members (created_at);

create trigger set_workspace_members_updated_at
before update on public.workspace_members
for each row
execute function public.set_updated_at();

-- Keep profiles in sync on auth signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
  set email = excluded.email,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Helper authorization functions.
create or replace function public.is_workspace_member(target_workspace_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = target_user_id
  );
$$;

create or replace function public.is_workspace_owner(target_workspace_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = target_user_id
      and wm.role = 'owner'
  );
$$;

-- Automatically add the creator as workspace owner.
create or replace function public.add_workspace_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.workspace_members (workspace_id, user_id, role, created_by, updated_by)
  values (new.id, new.created_by, 'owner', new.created_by, new.created_by)
  on conflict (workspace_id, user_id) do nothing;

  return new;
end;
$$;

create trigger add_workspace_owner_membership
after insert on public.workspaces
for each row
execute function public.add_workspace_owner_membership();

-- RLS
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

-- Profiles: users can only read/update their own profile.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

-- Workspaces: only members can read. Only owners can update.
drop policy if exists "workspaces_select_member" on public.workspaces;
create policy "workspaces_select_member"
on public.workspaces
for select
to authenticated
using (public.is_workspace_member(id));

drop policy if exists "workspaces_insert_authenticated" on public.workspaces;
create policy "workspaces_insert_authenticated"
on public.workspaces
for insert
to authenticated
with check (
  created_by = auth.uid()
  and updated_by = auth.uid()
);

drop policy if exists "workspaces_update_owner" on public.workspaces;
create policy "workspaces_update_owner"
on public.workspaces
for update
to authenticated
using (public.is_workspace_owner(id))
with check (
  public.is_workspace_owner(id)
  and updated_by = auth.uid()
);

-- Workspace members:
-- - Members can read membership rows for their own workspace.
-- - Owners can manage membership entries in their workspace.
drop policy if exists "workspace_members_select_member" on public.workspace_members;
create policy "workspace_members_select_member"
on public.workspace_members
for select
to authenticated
using (public.is_workspace_member(workspace_id));

drop policy if exists "workspace_members_insert_owner" on public.workspace_members;
create policy "workspace_members_insert_owner"
on public.workspace_members
for insert
to authenticated
with check (
  public.is_workspace_owner(workspace_id)
  and created_by = auth.uid()
  and updated_by = auth.uid()
);

drop policy if exists "workspace_members_update_owner" on public.workspace_members;
create policy "workspace_members_update_owner"
on public.workspace_members
for update
to authenticated
using (public.is_workspace_owner(workspace_id))
with check (
  public.is_workspace_owner(workspace_id)
  and updated_by = auth.uid()
);

drop policy if exists "workspace_members_delete_owner" on public.workspace_members;
create policy "workspace_members_delete_owner"
on public.workspace_members
for delete
to authenticated
using (public.is_workspace_owner(workspace_id));
