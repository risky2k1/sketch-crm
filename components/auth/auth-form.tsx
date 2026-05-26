"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { AuthActionState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const initialState: AuthActionState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Please wait..." : label}
    </Button>
  );
}

export function AuthForm({
  title,
  description,
  submitLabel,
  footer,
  action,
  includeFullName,
}: {
  title: string;
  description: string;
  submitLabel: string;
  footer: React.ReactNode;
  action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  includeFullName?: boolean;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <Card className="relative w-full max-w-md overflow-hidden border-border/80 bg-card/95 shadow-lg">
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl border border-dashed border-primary/30" />
      <CardHeader className="relative">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Sketch CRM</p>
        <CardTitle className="mt-2 text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <form action={formAction} className="space-y-4">
          {includeFullName ? <Input name="fullName" placeholder="Full name (optional)" /> : null}
          <Input name="email" type="email" placeholder="you@company.com" required />
          <Input name="password" type="password" placeholder="Password" required minLength={8} />

          {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-primary">{state.success}</p> : null}

          <SubmitButton label={submitLabel} />
        </form>

        <div className="mt-5 text-sm text-muted-foreground">{footer}</div>
      </CardContent>
    </Card>
  );
}

export function AuthFooterLink({ href, label, cta }: { href: string; label: string; cta: string }) {
  return (
    <>
      {label} <Link href={href} className="font-medium text-foreground underline underline-offset-4">{cta}</Link>
    </>
  );
}
