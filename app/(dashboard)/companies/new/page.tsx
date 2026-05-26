import { CompanyForm } from "@/components/crm/company-form";
import { ModuleHeader } from "@/components/layout/module-header";
import { createCompanyAction } from "@/features/companies/actions";

export default function NewCompanyPage() {
  return (
    <div className="space-y-4">
      <ModuleHeader title="Create Company" prefix="CRM" />
      <CompanyForm
        title="New company"
        description="Add a company to your workspace."
        action={createCompanyAction}
        submitLabel="Create company"
      />
    </div>
  );
}
