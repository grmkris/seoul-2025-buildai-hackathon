import { OrgModals } from "@/app/[locale]/[organizationId]/_lib/modals/OrgModals";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import {
  getActiveOrganization,
  setActiveOrganization,
} from "./_lib/hooks/organizationActions";
import type { OrganizationId } from "typeid";
import { redirect } from "@/navigation";
import { headers } from "next/headers";

export default async function SpecificOrganizationLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string; organizationId: OrganizationId }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { children } = props;
  setRequestLocale(locale);

  const headersList = await headers();
  const headersToUse = new Headers();
  for (const [key, value] of headersList.entries()) {
    headersToUse.set(key, value);
  }

  const activeOrganization = await getActiveOrganization({
    fetchOptions: {
      headers: headersToUse,
    },
  });

  console.log("activeOrganization", activeOrganization);

  const orgInUrl = params.organizationId;

  if (!activeOrganization) {
    setActiveOrganization({ organizationId: orgInUrl });
  }

  if (orgInUrl !== activeOrganization.id) {
    redirect({
      href: `${activeOrganization.id}`,
      locale,
    });
  }

  return (
    <div className="p-6">
      {children}
      <OrgModals />
    </div>
  );
}
