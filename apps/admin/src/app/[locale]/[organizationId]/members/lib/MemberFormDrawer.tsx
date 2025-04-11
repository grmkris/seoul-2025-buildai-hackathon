import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import type React from "react";
import { useForm } from "react-hook-form";
import { OrganizationRole } from "@/lib/utils";
import type { MemberId, OrganizationId } from "typeid";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import { useCreateMember, useUpdateMemberRole } from "./membersHooks";

// Define the member role schema
const memberRoleSchema = z.object({
  role: OrganizationRole,
});

type MemberRoleSchema = z.infer<typeof memberRoleSchema>;

const inviteUserSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(1, "Name is required"),
  role: OrganizationRole,
});

type InviteUserSchema = z.infer<typeof inviteUserSchema>;

interface MemberFormDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess?: () => void;
  title: string;
  triggerButton?: React.ReactNode;
  initialValues?: {
    id: MemberId;
    email: string;
    name?: string;
    role: OrganizationRole;
  };
}

export function MemberFormDrawer({
  isOpen,
  setIsOpen,
  onSuccess,
  title,
  triggerButton,
  initialValues,
}: MemberFormDrawerProps) {
  const t = useTranslations("Profile.Libs");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { organizationId } = useParams<{ organizationId: OrganizationId }>();

  // Initialize form for role update
  const roleForm = useForm<MemberRoleSchema>({
    resolver: zodResolver(memberRoleSchema),
    defaultValues: initialValues ? { role: initialValues.role } : undefined,
  });

  // Initialize form for inviting new user
  const inviteUserForm = useForm<InviteUserSchema>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      role: "member",
    },
  });

  const createMember = useCreateMember({
    onSuccess: () => {
      setIsOpen(false);
      onSuccess?.();
    },
  });

  const updateMemberRole = useUpdateMemberRole({
    onSuccess: () => {
      setIsOpen(false);
      onSuccess?.();
    },
  });

  const handleRoleSubmit = (data: MemberRoleSchema) => {
    if (!initialValues?.id) return;

    updateMemberRole.mutate({
      organizationId,
      memberId: initialValues.id,
      role: data.role,
    });
  };

  const handleInviteUser = (data: InviteUserSchema) => {
    createMember.mutate({
      email: data.email,
      name: data.name,
      role: data.role,
    });
  };

  // Content for Edit Member form
  const EditMemberContent = () => (
    <div className="p-4">
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Email</h3>
            <p className="text-muted-foreground text-sm">
              {initialValues?.email}
            </p>
          </div>

          {initialValues?.name && (
            <div>
              <h3 className="font-medium">Name</h3>
              <p className="text-muted-foreground text-sm">
                {initialValues.name}
              </p>
            </div>
          )}
        </div>

        <form
          onSubmit={roleForm.handleSubmit(handleRoleSubmit)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              className="border-input bg-background w-full rounded-md border px-3 py-2"
              {...roleForm.register("role")}
            >
              <option value="member">User</option>
              <option value="admin">Admin</option>
            </select>
            {roleForm.formState.errors.role && (
              <p className="text-destructive text-sm">
                {roleForm.formState.errors.role.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={updateMemberRole.isPending}
          >
            {updateMemberRole.isPending ? t("saving") : t("saveChanges")}
          </Button>
        </form>
      </div>
    </div>
  );

  // Content for Invite User form
  const InviteUserContent = () => (
    <div className="p-4">
      <form
        onSubmit={inviteUserForm.handleSubmit(handleInviteUser)}
        className="space-y-6"
      >
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="email@example.com"
            className="border-input bg-background w-full rounded-md border px-3 py-2"
            {...inviteUserForm.register("email")}
          />
          {inviteUserForm.formState.errors.email && (
            <p className="text-destructive text-sm">
              {inviteUserForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className="border-input bg-background w-full rounded-md border px-3 py-2"
            {...inviteUserForm.register("name")}
          />
          {inviteUserForm.formState.errors.name && (
            <p className="text-destructive text-sm">
              {inviteUserForm.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <select
            id="role"
            className="border-input bg-background w-full rounded-md border px-3 py-2"
            {...inviteUserForm.register("role")}
          >
            <option value="member">User</option>
            <option value="admin">Admin</option>
          </select>
          {inviteUserForm.formState.errors.role && (
            <p className="text-destructive text-sm">
              {inviteUserForm.formState.errors.role.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={createMember.isPending}
        >
          {createMember.isPending ? t("sending") : t("inviteMember")}
        </Button>
      </form>
    </div>
  );

  return (
    <>
      {isDesktop ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>{triggerButton}</SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
            {initialValues?.id ? <EditMemberContent /> : <InviteUserContent />}
          </SheetContent>
        </Sheet>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
          <DrawerContent className="flex h-[80vh] flex-col">
            <DrawerHeader className="shrink-0">
              <DrawerTitle>{title}</DrawerTitle>
            </DrawerHeader>
            <div className="grow overflow-y-auto">
              {initialValues?.id ? (
                <EditMemberContent />
              ) : (
                <InviteUserContent />
              )}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
