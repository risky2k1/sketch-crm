import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { ensureProfileForUser } from "@/lib/auth/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await ensureProfileForUser(user);

  return <AppShell>{children}</AppShell>;
}
