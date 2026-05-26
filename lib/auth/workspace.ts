import { createSupabaseServerClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

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
  const baseSlug = slugify(`${seed}-workspace`) || "workspace";
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`;

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert({
      name: `${seed.charAt(0).toUpperCase()}${seed.slice(1)} Workspace`,
      slug,
      owner_id: userId,
      created_by: userId,
      updated_by: userId,
    })
    .select("id")
    .single();

  if (error || !workspace) {
    throw new Error(error?.message || "Unable to create workspace.");
  }

  return workspace.id;
}
