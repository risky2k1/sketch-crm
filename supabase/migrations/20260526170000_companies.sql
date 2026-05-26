-- Companies module foundation (MVP)
--
-- Adds:
-- - companies table
-- - indexes for common list/filter patterns
-- - RLS policies scoped by workspace membership
--
-- Security model:
-- - Any authenticated workspace member can CRUD companies in their workspace
-- - Users cannot access companies in workspaces they are not members of

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 160),
  domain text,
  industry text,
  size text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references public.profiles (id),
  updated_by uuid not null references public.profiles (id)
);

create index if not exists idx_companies_workspace_id on public.companies (workspace_id);
create index if not exists idx_companies_created_at on public.companies (created_at desc);
create index if not exists idx_companies_name on public.companies (name);
create index if not exists idx_companies_domain on public.companies (domain);

create trigger set_companies_updated_at
before update on public.companies
for each row
execute function public.set_updated_at();

alter table public.companies enable row level security;

drop policy if exists "companies_select_member" on public.companies;
create policy "companies_select_member"
on public.companies
for select
to authenticated
using (public.is_workspace_member(workspace_id));

drop policy if exists "companies_insert_member" on public.companies;
create policy "companies_insert_member"
on public.companies
for insert
to authenticated
with check (
  public.is_workspace_member(workspace_id)
  and created_by = auth.uid()
  and updated_by = auth.uid()
);

drop policy if exists "companies_update_member" on public.companies;
create policy "companies_update_member"
on public.companies
for update
to authenticated
using (public.is_workspace_member(workspace_id))
with check (
  public.is_workspace_member(workspace_id)
  and updated_by = auth.uid()
);

drop policy if exists "companies_delete_member" on public.companies;
create policy "companies_delete_member"
on public.companies
for delete
to authenticated
using (public.is_workspace_member(workspace_id));
