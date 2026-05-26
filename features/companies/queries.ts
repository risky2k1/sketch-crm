import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCompaniesByWorkspace(workspaceId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("companies")
    .select("id,name,domain,industry,size,description,workspace_id,created_at,updated_at")
    .eq("workspace_id", workspaceId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCompanyById(companyId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("companies")
    .select("id,name,domain,industry,size,description,workspace_id")
    .eq("id", companyId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return data;
}
