import Link from "next/link";
import { Pencil } from "lucide-react";

import { CompanyDeleteButton } from "@/components/crm/company-delete-button";
import { SketchCompaniesEmpty } from "@/components/sketch/sketch-companies-empty";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteCompanyAction } from "@/features/companies/actions";
import { getCompaniesByWorkspace } from "@/features/companies/queries";
import { getOrCreateCurrentWorkspaceId } from "@/lib/auth/workspace";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CompaniesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const workspaceId = await getOrCreateCurrentWorkspaceId(user.id, user.email);
  const companies = await getCompaniesByWorkspace(workspaceId);

  return (
    <div className="space-y-6">
      <section className="flex items-end justify-between gap-3 rounded-xl border border-border bg-card p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">CRM Module</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Companies</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage organizations in your current workspace.</p>
        </div>
        <Link href="/companies/new" className={buttonVariants()}>
          Create company
        </Link>
      </section>

      {companies.length === 0 ? (
        <SketchCompaniesEmpty />
      ) : (
        <section className="grid gap-3">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[company.domain, company.industry, company.size].filter(Boolean).join(" • ") || "No metadata yet"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/companies/${company.id}/edit`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Link>
                  <CompanyDeleteButton action={deleteCompanyAction.bind(null, company.id)} name={company.name} />
                </div>
              </CardHeader>
              {company.description ? (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{company.description}</p>
                </CardContent>
              ) : null}
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
