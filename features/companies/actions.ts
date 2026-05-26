"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getOrCreateCurrentWorkspaceId } from "@/lib/auth/workspace";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { companySchema } from "./schema";

export type CompanyActionState = {
  error?: string;
};

function toFormPayload(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    domain: String(formData.get("domain") ?? ""),
    industry: String(formData.get("industry") ?? ""),
    size: String(formData.get("size") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}

async function getAuthContext() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const workspaceId = await getOrCreateCurrentWorkspaceId(user.id, user.email);
  return { supabase, userId: user.id, workspaceId };
}

export async function createCompanyAction(_: CompanyActionState, formData: FormData): Promise<CompanyActionState> {
  const parsed = companySchema.safeParse(toFormPayload(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input." };
  }

  const { supabase, userId, workspaceId } = await getAuthContext();

  const { error } = await supabase.from("companies").insert({
    workspace_id: workspaceId,
    name: parsed.data.name,
    domain: parsed.data.domain,
    industry: parsed.data.industry,
    size: parsed.data.size,
    description: parsed.data.description,
    created_by: userId,
    updated_by: userId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/companies");
  redirect("/companies");
}

export async function updateCompanyAction(
  companyId: string,
  _: CompanyActionState,
  formData: FormData,
): Promise<CompanyActionState> {
  const parsed = companySchema.safeParse(toFormPayload(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input." };
  }

  const { supabase, userId } = await getAuthContext();

  const { error } = await supabase
    .from("companies")
    .update({
      name: parsed.data.name,
      domain: parsed.data.domain,
      industry: parsed.data.industry,
      size: parsed.data.size,
      description: parsed.data.description,
      updated_by: userId,
    })
    .eq("id", companyId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/companies");
  redirect("/companies");
}

export async function deleteCompanyAction(companyId: string) {
  const { supabase } = await getAuthContext();

  const { error } = await supabase.from("companies").delete().eq("id", companyId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/companies");
}
