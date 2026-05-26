-- Grant CRUD privileges for Data API roles.
-- RLS policies still enforce row-level access; grants only allow operations to reach policy checks.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.workspaces to authenticated;
grant select, insert, update, delete on table public.workspace_members to authenticated;
grant select, insert, update, delete on table public.companies to authenticated;

-- Optional read-only grants for anon; keep strict by default (no table DML grants).
