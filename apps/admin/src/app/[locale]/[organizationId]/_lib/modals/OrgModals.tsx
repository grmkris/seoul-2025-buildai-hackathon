"use client";
import { WorkspaceModal } from "@/app/[locale]/[organizationId]/_lib/modals/WorkspaceModal";
import { useOrgModals } from "@/app/[locale]/[organizationId]/_lib/modals/useOrgModals";

export const OrgModals = () => {
  const view = useOrgModals((state) => state.view);
  return <>{view === "WorkspaceModal" && <WorkspaceModal />}</>;
};
