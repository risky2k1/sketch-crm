import { notFound } from "next/navigation";

import { CompanyForm } from "@/components/crm/company-form";
import { updateCompanyAction } from "@/features/companies/actions";
import { getCompanyById } from "@/features/companies/queries";

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyById(id);

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Company</h1>
      <CompanyForm
        title={company.name}
        description="Update company profile fields in your workspace."
        action={updateCompanyAction.bind(null, id)}
        submitLabel="Save changes"
        defaultValues={{
          name: company.name,
          domain: company.domain,
          industry: company.industry,
          size: company.size,
          description: company.description,
        }}
      />
    </div>
  );
}
