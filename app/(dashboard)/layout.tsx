import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureProfileForCurrentUser, getUserWorkspaces } from "@/lib/supabase/workspaces";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await ensureProfileForCurrentUser();
  const workspaces = await getUserWorkspaces();

  return <AppShell initialWorkspaces={workspaces}>{children}</AppShell>;
}
