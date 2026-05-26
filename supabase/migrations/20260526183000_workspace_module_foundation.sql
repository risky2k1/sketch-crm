-- Workspace module hardening for Sketch CRM MVP.
-- This migration aligns schema and RLS with the first usable Workspace module:
-- - profile access
-- - workspace membership isolation
-- - workspace creation with atomic owner membership

create extension if not exists pgcrypto;

-- Keep tables compatible with existing code while adding required owner_id.
alter table public.workspaces
  add column if not exists owner_id uuid references public.profiles (id);

update public.workspaces
set owner_id = created_by
where owner_id is null;

alter table public.workspaces
  alter column owner_id set not null;

-- Requirement: slug unique, but optional.
alter table public.workspaces
  alter column slug drop not null;

-- Keep role set constrained to owner/admin/member.
alter table public.workspace_members
  drop constraint if exists workspace_members_role_check;

alter table public.workspace_members
  add constraint workspace_members_role_check
  check (role in ('owner', 'admin', 'member'));

-- Helpful indexes for workspace module queries.
create index if not exists idx_workspaces_owner_id on public.workspaces (owner_id);
create index if not exists idx_workspace_members_workspace_role on public.workspace_members (workspace_id, role);

-- Helpers for RLS policies.
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

create or replace function public.has_workspace_role(
  target_workspace_id uuid,
  allowed_roles text[],
  target_user_id uuid default auth.uid()
)
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
      and wm.role = any (allowed_roles)
  );
$$;

-- Guard owner membership from non-owner changes/deletion.
create or replace function public.guard_workspace_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_owner_row boolean;
begin
  is_owner_row := coalesce(new.role = 'owner', old.role = 'owner');

  if is_owner_row and not public.has_workspace_role(coalesce(new.workspace_id, old.workspace_id), array['owner']) then
    raise exception 'Only workspace owners can modify owner membership';
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists guard_owner_membership_update on public.workspace_members;
create trigger guard_owner_membership_update
before update on public.workspace_members
for each row
when (old.role = 'owner')
execute function public.guard_workspace_owner_membership();

drop trigger if exists guard_owner_membership_delete on public.workspace_members;
create trigger guard_owner_membership_delete
before delete on public.workspace_members
for each row
when (old.role = 'owner')
execute function public.guard_workspace_owner_membership();

-- Atomic workspace creation API.
create or replace function public.create_workspace(workspace_name text)
returns public.workspaces
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  base_slug text;
  candidate_slug text;
  suffix int := 0;
  new_workspace public.workspaces;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if workspace_name is null or btrim(workspace_name) = '' then
    raise exception 'Workspace name is required';
  end if;

  base_slug := regexp_replace(lower(btrim(workspace_name)), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'workspace';
  end if;

  candidate_slug := base_slug;
  while exists (select 1 from public.workspaces where slug = candidate_slug) loop
    suffix := suffix + 1;
    candidate_slug := left(base_slug, 54) || '-' || suffix::text;
  end loop;

  insert into public.workspaces (name, slug, owner_id, created_by, updated_by)
  values (btrim(workspace_name), candidate_slug, current_user_id, current_user_id, current_user_id)
  returning * into new_workspace;

  insert into public.workspace_members (workspace_id, user_id, role, created_by, updated_by)
  values (new_workspace.id, current_user_id, 'owner', current_user_id, current_user_id)
  on conflict (workspace_id, user_id) do nothing;

  return new_workspace;
end;
$$;

grant execute on function public.create_workspace(text) to authenticated;

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

-- Profiles: user can read/update own row only.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

-- Workspaces: member read, owner-authored insert, owner/admin update.
drop policy if exists workspaces_select_member on public.workspaces;
create policy workspaces_select_member
on public.workspaces
for select
to authenticated
using (public.is_workspace_member(id));

drop policy if exists workspaces_insert_owner on public.workspaces;
create policy workspaces_insert_owner
on public.workspaces
for insert
to authenticated
with check (
  owner_id = auth.uid()
  and created_by = auth.uid()
  and updated_by = auth.uid()
);

drop policy if exists workspaces_update_owner_admin on public.workspaces;
create policy workspaces_update_owner_admin
on public.workspaces
for update
to authenticated
using (public.has_workspace_role(id, array['owner', 'admin']))
with check (public.has_workspace_role(id, array['owner', 'admin']));

-- Workspace members: member read, owner/admin write.
drop policy if exists workspace_members_select_member on public.workspace_members;
create policy workspace_members_select_member
on public.workspace_members
for select
to authenticated
using (public.is_workspace_member(workspace_id));

drop policy if exists workspace_members_insert_owner_admin on public.workspace_members;
create policy workspace_members_insert_owner_admin
on public.workspace_members
for insert
to authenticated
with check (public.has_workspace_role(workspace_id, array['owner', 'admin']));

drop policy if exists workspace_members_update_owner_admin on public.workspace_members;
create policy workspace_members_update_owner_admin
on public.workspace_members
for update
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'admin']))
with check (public.has_workspace_role(workspace_id, array['owner', 'admin']));

drop policy if exists workspace_members_delete_owner_admin on public.workspace_members;
create policy workspace_members_delete_owner_admin
on public.workspace_members
for delete
to authenticated
using (public.has_workspace_role(workspace_id, array['owner', 'admin']));
