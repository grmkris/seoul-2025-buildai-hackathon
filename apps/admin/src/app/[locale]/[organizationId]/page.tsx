"use client";

import {
  useWorkspaces,
} from "@/app/[locale]/[organizationId]/[workspaceId]/_lib/hooks/workspaceHooks";
import { useOrgModals } from "@/app/[locale]/[organizationId]/_lib/modals/useOrgModals";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Link } from "@/navigation";
import { format } from "date-fns";
import {
  EllipsisVertical,
  LoaderCircle,
  Pen,
  PlusCircle,
  Tractor,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import React from "react";
import type { WorkspaceId } from "typeid";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import UsersPage from "./members/page";

export default function OrganizationPage() {
  const t = useTranslations("Organization");
  const params = useParams();
  const openModal = useOrgModals((state) => state.open);
  const [_, setLastWorkspaceId] = useLocalStorage<string | null>(
    `lastWorkspaceId-${params?.organizationId}`,
    null,
  );
  const { workspaces, isLoading, error } = useWorkspaces();
  
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "workspaces",
  });

  if (isLoading) return <LoaderCircle className="animate-spin" />;
  if (error) return <div>Error loading workspaces: {error.message}</div>;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value)}
      className="space-y-6"
    >
      <TabsContent value="workspaces">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tractor />
            <h2 className="pl-10 text-2xl font-bold lg:pl-0">
              {t("workspaces")}
            </h2>
          </div>

          <Button
            className="h-8"
            onClick={() => {
              openModal("WorkspaceModal");
            }}
          >
            <PlusCircle className="size-4" />
            <span>{t("createNewWorkspace")}</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className="h-full border border-teal-500 dark:border-teal-800 min-w-60 w-full"
            >
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>{workspace.name}</CardTitle>
                  <p className="text-gray-500 text-xs">
                    <span className="pr-1">ID:</span>
                    {workspace.id}
                  </p>
                </div>
                <Popover>
                  <PopoverTrigger className="p-1 rounded-lg border border-teal-500 dark:border-teal-800 cursor-pointer hover:opacity-60">
                    <EllipsisVertical
                      size={16}
                      className="text-teal-500 dark:text-teal-800"
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="flex flex-col w-fit p-0"
                  >
                    <Button
                      className="justify-start"
                      variant="ghost"
                      onClick={() => {
                        openModal("WorkspaceModal", {
                          workspaceId: workspace.id,
                          name: workspace.name,
                        });
                      }}
                    >
                      <Pen className="!h-3.5" />
                      <p className="text-xs">Edit</p>
                    </Button>
                  </PopoverContent>
                </Popover>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-900 text-xs">
                  <span className="pr-1 text-gray-500">Created At:</span>
                  {format(new Date(workspace.createdAt), "dd/MM/yyyy HH:mm")}
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/${params?.organizationId}/${workspace.id}`}
                  className="block h-full"
                  onClick={() => setLastWorkspaceId(workspace.id)}
                >
                  <Button className="w-full h-8"> Enter</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="users">
        <UsersPage />
      </TabsContent>
    </Tabs>
  );
}
