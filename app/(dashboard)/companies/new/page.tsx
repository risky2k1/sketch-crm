import { CompanyForm } from "@/components/crm/company-form";
import { createCompanyAction } from "@/features/companies/actions";

export default function NewCompanyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Create Company</h1>
      <CompanyForm
        title="New company"
        description="Add a company to your workspace."
        action={createCompanyAction}
        submitLabel="Create company"
      />
    </div>
  );
}
