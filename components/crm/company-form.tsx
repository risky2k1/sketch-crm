"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { CompanyActionState } from "@/features/companies/actions";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: CompanyActionState = {};

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  );
}

export function CompanyForm({
  title,
  description,
  action,
  defaultValues,
  submitLabel,
}: {
  title: string;
  description: string;
  action: (state: CompanyActionState, formData: FormData) => Promise<CompanyActionState>;
  defaultValues?: {
    name?: string;
    domain?: string | null;
    industry?: string | null;
    size?: string | null;
    description?: string | null;
  };
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <Card>
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Companies</p>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium">Name</span>
              <Input name="name" defaultValue={defaultValues?.name ?? ""} required maxLength={160} />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Domain</span>
              <Input name="domain" placeholder="example.com" defaultValue={defaultValues?.domain ?? ""} maxLength={160} />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Industry</span>
              <Input name="industry" defaultValue={defaultValues?.industry ?? ""} maxLength={120} />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Size</span>
              <Input name="size" placeholder="1-10, 11-50, 51-200" defaultValue={defaultValues?.size ?? ""} maxLength={80} />
            </label>
          </div>

          <label className="space-y-2 text-sm">
            <span className="font-medium">Description</span>
            <Textarea name="description" defaultValue={defaultValues?.description ?? ""} maxLength={4000} />
          </label>

          {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

          <div className="flex items-center gap-2">
            <SaveButton label={submitLabel} />
            <Link href="/companies" className={buttonVariants({ variant: "outline" })}>
              Cancel
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
