"use client";

import { CustomersTable } from "@/app/[locale]/[organizationId]/[workspaceId]/customers/_lib/CustomersTable";
import {
  useActiveOrganization,
  useActiveWorkspace,
} from "@/app/_lib/useActiveUrlParams";
import { Loader } from "@/components/Loader";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default function CustomersPage() {
  const t = useTranslations("Workspace.Customers");
  const activeOrganization = useActiveOrganization();
  const activeWorkspace = useActiveWorkspace();

  return (
    <PageContainer
      title={t("customers")}
      description="Manage your customer database, view customer details, and keep track
                of all your customer relationships"
      actions={[
        <Link
          key="add-customer"
          href={`/${activeOrganization}/${activeWorkspace}/customers/new`}
        >
          <Button variant="default">{t("addCustomer")}</Button>
        </Link>,
      ]}
    >
      <Card className="shadow-none bg-base-background">
        <div className="w-full overflow-x-auto">
          <Suspense fallback={<Loader />}>
            <CustomersTable />
          </Suspense>
        </div>
      </Card>
    </PageContainer>
  );
}
