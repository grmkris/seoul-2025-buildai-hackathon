"use client";

import { useLogout } from "@/app/[locale]/auth/authHooks";
import { MenuSelector } from "@/app/_lib/components/menu-selector";
import { NavMenu } from "@/app/_lib/components/nav-menu";
import { NavUser } from "@/app/_lib/components/nav-user";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import type * as React from "react";

export function ClientSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const isInsideOrganization = Boolean(params?.organizationId);
  const logout = useLogout();

  return (
    <Sidebar collapsible="icon" {...props} className="bg-base-background">
      <SidebarHeader>
        <MenuSelector isWorkspace={isInsideOrganization} />
      </SidebarHeader>
      <SidebarContent>
        <NavMenu />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between">
          <div className="w-40 border border-gray-200 p-1 rounded-lg">
            <LocaleSwitcher />
          </div>
          <div className="border border-gray-200 rounded-lg">
            <ThemeToggle />
          </div>
        </div>
        <NavUser
          onLogout={() => {
            logout.mutate();
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
