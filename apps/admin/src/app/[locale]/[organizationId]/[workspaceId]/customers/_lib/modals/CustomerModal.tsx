"use client";

import { useWorkspaceModals } from "@/app/[locale]/[organizationId]/[workspaceId]/_lib/modals/useWorkspaceModals";
import type { InsertCustomerSchema } from "@/app/[locale]/[organizationId]/[workspaceId]/customers/_lib/hooks/customerActions";
import { useCreateCustomer } from "@/app/[locale]/[organizationId]/[workspaceId]/customers/_lib/hooks/customerHooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { CustomerForm } from "../forms/CustomerForm";

export const CustomerModal = () => {
  const modal = useWorkspaceModals((state) => state);
  const t = useTranslations("Workspace.Customers");
  const createCustomerMutation = useCreateCustomer({
    onSuccess: () => modal.close(),
    onError: (error) => console.error("Failed to create customer:", error),
  });

  const handleSubmit = async (data: InsertCustomerSchema) => {
    await createCustomerMutation.mutateAsync(data);
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent className="scrollable flex max-h-[85vh] !max-w-[781px] flex-col justify-between gap-4 overflow-auto rounded-2xl bg-gray-100 p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="font-outfit-bold text-[22px] text-primary-900">
              {t("createCustomer")}
            </div>
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <CustomerForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};
