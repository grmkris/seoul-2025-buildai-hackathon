"use client";
import { useWorkspaceModals } from "@/app/[locale]/[organizationId]/[workspaceId]/_lib/modals/useWorkspaceModals";
import { CustomerModal } from "@/app/[locale]/[organizationId]/[workspaceId]/customers/_lib/modals/CustomerModal";

export const WorkspaceModals = () => {
  const view = useWorkspaceModals((state) => state.view);
  return (
    <>
      {view === "CustomerModal" && <CustomerModal />}
    </>
  );
};
