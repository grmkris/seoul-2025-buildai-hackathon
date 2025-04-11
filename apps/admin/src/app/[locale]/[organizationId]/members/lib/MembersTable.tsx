"use client";

import {
  useDeleteMember,
  useOrganizationMembers,
} from "@/app/[locale]/[organizationId]/members/lib/membersHooks";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/components/data-table/hooks/use-data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { MemberFormDrawer } from "./MemberFormDrawer";
import type { Member } from "./memberActions";
import { OrganizationRole } from "@/lib/utils";


function DeleteMemberButton({ member }: { member: Member }) {
  const t = useTranslations("Profile.Libs");
  const deleteMemberMutation = useDeleteMember({
    onError: (error: unknown) =>
      console.error("Failed to delete member:", error),
  });

  const handleDelete = () => {
    deleteMemberMutation.mutate(member.id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {t("delete")}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("thisActionDeletesUser")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            {deleteMemberMutation.isPending ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function MembersTable() {
  const t = useTranslations("Profile.Libs");
  const { members } = useOrganizationMembers();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();

  const { table } = useDataTable({
    data: members ?? [],
    columns: [
      {
        accessorKey: "name",
        header: t("name"),
        cell: ({ row }) => {
          const member = row.original;
          return <div>{member.user.name || "-"}</div>;
        },
      },
      {
        accessorKey: "email",
        header: t("email"),
        cell: ({ row }) => {
          const member = row.original;
          return <div>{member.user.email}</div>;
        },
      },
      {
        accessorKey: "role",
        header: t("role"),
      },
      {
        id: "actions",
        enablePinning: true,
        cell: ({ row }) => {
          const member = row.original;
          return (
            <div className="flex justify-end md:justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <span className="sr-only">{t("openMenu")}</span>
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedMember(member);
                      setIsDrawerOpen(true);
                    }}
                  >
                    {t("edit")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DeleteMemberButton member={member} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    pageCount: members?.length ?? 0,
    getRowId: (row) => row.id.toString(),
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
  });

  return (
    <div className="space-y-4">
      <MemberFormDrawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        onSuccess={() => setSelectedMember(undefined)}
        title={selectedMember ? t("edit") : t("inviteMember")}
        initialValues={
          selectedMember
            ? {
                id: selectedMember.id,
                email: selectedMember.user.email,
                name: selectedMember.user.name,
                role: OrganizationRole.parse(selectedMember.role),
              }
            : undefined
        }
      />
      <div className="rounded-md border">
        <DataTable table={table}>
          <DataTableToolbar table={table} />
        </DataTable>
      </div>
    </div>
  );
}
