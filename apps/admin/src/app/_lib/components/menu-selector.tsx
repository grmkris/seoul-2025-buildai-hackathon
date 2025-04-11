import { useWorkspaces } from "@/app/[locale]/[organizationId]/[workspaceId]/_lib/hooks/workspaceHooks";
import {
  useCreateOrganization,
  useOrganization,
} from "@/app/[locale]/[organizationId]/_lib/hooks/organizationsHooks";
import { useOrganizations } from "@/app/[locale]/auth/authHooks";
import {
  useActiveOrganization,
  useActiveWorkspace,
} from "@/app/_lib/useActiveUrlParams";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRouter } from "@/navigation";
import {
  Building,
  ChevronRight,
  ChevronsUpDown,
  Settings,
  Tractor,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import type { OrganizationId } from "typeid";
import { useLocalStorage } from "usehooks-ts";

export const MenuSelector = ({ isWorkspace }: { isWorkspace?: boolean }) => {
  const { workspaces, isLoading, error } = useWorkspaces();
  const { isMobile } = useSidebar();
  const t = useTranslations("Menu");
  const organizations = useOrganizations();
  const locale = useLocale();
  const params = useParams();
  const [newOrgName, setNewOrgName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const activeWorkspaceId = useActiveWorkspace();
  const activeOrganizationId = useActiveOrganization();
  const router = useRouter();
  const [, setLastWorkspaceId] = useLocalStorage<string | null>(
    `lastWorkspaceId-${params?.organizationId}`,
    null,
  );
  const activeOrganization = useOrganization(activeOrganizationId);
  const activeWorkspace = workspaces.find(
    (workspace) => workspace.id === activeWorkspaceId,
  );

  const handleWorkspaceClick = (workspaceId: string | null) => {
    if (workspaceId) {
      router.push(`/${activeOrganizationId}/${workspaceId}`);
      setLastWorkspaceId(workspaceId);
    } else {
      setLastWorkspaceId(null);
      router.push(`/${activeOrganizationId}?tab=workspaces`);
    }
  };

  const createOrganization = useCreateOrganization({
    onSuccess: () => {
      setIsDialogOpen(false);
      setNewOrgName("");
    },
    onError: (error) => {
      console.error("Failed to create organization:", error);
    },
  });

  const handleOrganizationChange = (organizationId: OrganizationId) => {
    window.location.href = `/${locale}/${organizationId}?tab=workspaces`;
  };

  const handleCreateOrganization = () => {
    if (newOrgName.trim()) {
      createOrganization.mutate({ name: newOrgName.trim() });
    }
  };

  if (isLoading) {
    return <Skeleton className="h-9 w-40" />;
  }

  return (
    <>
      <SidebarMenu className="mt-2.5">
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                tooltip={isWorkspace ? t("workspaces") : "Organizations"}
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground px-0 cursor-pointer"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-teal-500 text-xs text-base-background">
                  {isWorkspace ? (
                    <Tractor className="size-4 w-10" />
                  ) : (
                    <Building className="size-4 w-10" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {isWorkspace ? (
                        <>
                          {activeWorkspace
                            ? activeWorkspace.name
                            : t("selectWorkspace")}
                        </>
                      ) : (
                        "Select Organization"
                      )}
                    </span>
                  </div>
                  <span className="truncate pt-0.5 text-xs text-gray-500">
                    {isWorkspace ? activeOrganization?.organization?.name : ""}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-80 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="start"
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {isWorkspace ? t("workspaces") : "Organizations"}
              </DropdownMenuLabel>
              {isLoading ? (
                <>
                  <Skeleton className="my-1 h-8 w-full" />
                  <Skeleton className="my-1 h-8 w-full" />
                  <Skeleton className="my-1 h-8 w-full" />
                </>
              ) : error ? (
                <DropdownMenuItem disabled>
                  {isWorkspace ? t("errorLoadingWorkspaces") : "Sth went wrong"}
                </DropdownMenuItem>
              ) : isWorkspace && workspaces.length > 0 ? (
                workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onSelect={() => handleWorkspaceClick(workspace.id)}
                    className={cn(
                      "gap-2 truncate p-2",
                      workspace.id === activeWorkspaceId
                        ? "text-teal-500"
                        : "cursor-pointer",
                    )}
                  >
                    <div className="rounded-sm border">
                      <div className="w-full p-1">
                        <Tractor className="size-4" />
                      </div>
                    </div>
                    <div className="truncate">{workspace.name}</div>
                  </DropdownMenuItem>
                ))
              ) : !isWorkspace &&
                organizations.data &&
                organizations.data?.length > 0 ? (
                organizations.data.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onSelect={() =>
                      handleOrganizationChange(org.id as OrganizationId)
                    }
                    className={cn(
                      "gap-2 truncate p-2",
                      org.id === activeOrganizationId
                        ? "text-teal-500"
                        : "cursor-pointer",
                    )}
                  >
                    <div className="rounded-sm border">
                      <div className="w-full p-1">
                        <Building className="size-4" />
                      </div>
                    </div>
                    <div className="truncate">{org.name}</div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  {isWorkspace ? t("noWorkspaces") : "No Org"}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {isWorkspace ? (
                <DropdownMenuItem
                  className="justify-between gap-2 p-2"
                  onSelect={() => handleWorkspaceClick(null)}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 cursor-pointer items-center justify-center rounded-md border bg-background">
                      <Settings className="size-4" />
                    </div>
                    {t("manageWorkspaces")}
                  </div>
                  <ChevronRight className="size-4" />
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="justify-between gap-2 p-2"
                  onSelect={() => setIsDialogOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 cursor-pointer items-center justify-center rounded-md border bg-background">
                      <Settings className="size-4" />
                    </div>
                    {t("newOrganization")}
                  </div>
                  <ChevronRight className="size-4" />
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("newOrganization")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <Input
              placeholder={t("organizationName")}
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
            />
            <Button
              onClick={handleCreateOrganization}
              disabled={createOrganization.isPending}
            >
              {createOrganization.isPending ? t("creating") : t("create")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
