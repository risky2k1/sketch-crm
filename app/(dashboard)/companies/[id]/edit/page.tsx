import { notFound } from "next/navigation";

import { CompanyForm } from "@/components/crm/company-form";
import { ModuleHeader } from "@/components/layout/module-header";
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
      <ModuleHeader title="Edit Company" prefix="CRM" />
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
