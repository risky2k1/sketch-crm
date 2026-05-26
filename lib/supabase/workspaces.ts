import type { Profile, Workspace, WorkspaceMember } from "@/features/workspaces/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error && error.code !== "PGRST116") throw new Error(error.message);

  return data;
}

export async function ensureProfileForCurrentUser(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email ?? null,
        full_name: typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null,
      },
      { onConflict: "id" },
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function getUserWorkspaces(): Promise<Workspace[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("id,name,slug,owner_id,created_at,updated_at")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
}

export async function getWorkspaceById(workspaceId: string): Promise<Workspace | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("workspaces")
    .select("id,name,slug,owner_id,created_at,updated_at")
    .eq("id", workspaceId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw new Error(error.message);

  return data;
}

export async function createWorkspace(name: string): Promise<Workspace> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("create_workspace", { workspace_name: name }).single();

  if (error || !data) throw new Error(error?.message ?? "Unable to create workspace.");

  return data as Workspace;
}

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("workspace_members")
    .select("id,workspace_id,user_id,role,created_at,profiles!workspace_members_user_id_fkey(id,email,full_name)")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data.map((row) => ({
    id: row.id,
    workspace_id: row.workspace_id,
    user_id: row.user_id,
    role: row.role,
    created_at: row.created_at,
    profile: Array.isArray(row.profiles) ? row.profiles[0] ?? null : row.profiles,
  })) as WorkspaceMember[];
}
