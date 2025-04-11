"use client";

import type { InsertCustomerSchema } from "@/app/[locale]/[organizationId]/[workspaceId]/customers/_lib/hooks/customerActions";
import { useCreateCustomer } from "@/app/[locale]/[organizationId]/[workspaceId]/customers/_lib/hooks/customerHooks";
import {
  useActiveOrganization,
  useActiveWorkspace,
} from "@/app/_lib/useActiveUrlParams";
import { PageContainer } from "@/components/PageContainer";
import { Card } from "@/components/ui/card";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { CustomerForm } from "../_lib/forms/CustomerForm";

export default function NewCustomerPage() {
  const t = useTranslations("Workspace.Customers");
  const activeOrganization = useActiveOrganization();
  const activeWorkspace = useActiveWorkspace();
  const router = useRouter();
  const createCustomerMutation = useCreateCustomer({
    onSuccess: (data) =>
      router.push(
        `/${activeOrganization}/${activeWorkspace}/customers/${data.id}`,
      ),
    onError: (error) => console.error("Failed to create customer:", error),
  });

  const handleSubmit = async (data: InsertCustomerSchema) => {
    await createCustomerMutation.mutateAsync(data);
  };

  return (
    <PageContainer
      title={"New Customer"}
      description="Create a new customer profile"
      href={`/${activeOrganization}/${activeWorkspace}/customers`}
      hrefName={t("backToCustomers")}
    >
      <Card>
        <CustomerForm onSubmit={handleSubmit} />
      </Card>
    </PageContainer>
  );
}
