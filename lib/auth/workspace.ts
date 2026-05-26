import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getOrCreateCurrentWorkspaceId(userId: string, fallbackEmail?: string | null) {
  const supabase = await createSupabaseServerClient();

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membership?.workspace_id) {
    return membership.workspace_id;
  }

  const seed = fallbackEmail?.split("@")[0] || "workspace";
  const workspaceName = `${seed.charAt(0).toUpperCase()}${seed.slice(1)} Workspace`;
  const { data: workspace, error } = await supabase
    .rpc("create_workspace", { workspace_name: workspaceName })
    .single();

  if (error || !workspace) {
    throw new Error(error?.message || "Unable to create workspace.");
  }

  return (workspace as { id: string }).id;
}
