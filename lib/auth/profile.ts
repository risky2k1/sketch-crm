import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function ensureProfileForUser(user: User, fullName?: string) {
  const supabase = await createSupabaseServerClient();

  const nameFromMetadata =
    typeof user.user_metadata?.full_name === "string" ? (user.user_metadata.full_name as string) : null;

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name: fullName ?? nameFromMetadata,
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("Failed to ensure profile", error);
  }
}
