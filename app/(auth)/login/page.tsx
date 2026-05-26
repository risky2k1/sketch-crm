import { redirect } from "next/navigation";

import { loginAction } from "@/app/(auth)/actions";
import { AuthFooterLink, AuthForm } from "@/components/auth/auth-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LoginPage() {
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
        title="Welcome back"
        description="Sign in to continue to your workspace dashboard."
        submitLabel="Sign in"
        action={loginAction}
        footer={<AuthFooterLink href="/register" label="Need an account?" cta="Create one" />}
      />
    </main>
  );
}
