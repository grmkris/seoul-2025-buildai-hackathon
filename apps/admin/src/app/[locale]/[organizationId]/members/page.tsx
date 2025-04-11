"use client";

import { MemberFormDrawer } from "@/app/[locale]/[organizationId]/members/lib/MemberFormDrawer";
import { MembersTable } from "@/app/[locale]/[organizationId]/members/lib/MembersTable";
import { useCurrentUser, useRole } from "@/app/[locale]/auth/authHooks";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function UsersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const role = useRole();
  const t = useTranslations("Profile.Libs");
  const currentUser = useCurrentUser();

  if (!currentUser) {
    notFound();
  }

  return (
    <div>
      <div className="flex flex-col gap-y-12">
        <div className="mb-6 flex items-center justify-between">
          {role?.data?.role && ["admin", "owner"].includes(role.data.role) && (
            <MemberFormDrawer
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              onSuccess={() => {}}
              title={t("inviteMember")}
              triggerButton={
                <Button className="mr-4">
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  {t("inviteMember")}
                </Button>
              }
            />
          )}
        </div>
        <MembersTable />
      </div>
    </div>
  );
}
