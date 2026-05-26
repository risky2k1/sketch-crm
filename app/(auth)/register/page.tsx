import { redirect } from "next/navigation";

import { registerAction } from "@/app/(auth)/actions";
import { AuthFooterLink, AuthForm } from "@/components/auth/auth-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function RegisterPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <AuthForm
        title="Create your account"
        description="Start with a clean CRM workspace and invite your team later."
        submitLabel="Create account"
        action={registerAction}
        includeFullName
        footer={<AuthFooterLink href="/login" label="Already have an account?" cta="Sign in" />}
      />
    </main>
  );
}
