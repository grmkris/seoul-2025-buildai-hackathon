"use client";

import { ChevronRight, Settings } from "lucide-react";

import { useActiveOrganization } from "@/app/_lib/useActiveUrlParams";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "@/navigation";
import { workspaceStorage } from "@/utils/storage";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export function OrganizationsSettings() {
  const router = useRouter();
  const activeOrganizationId = useActiveOrganization();
  const _params = useParams();
  const pathname = usePathname();
  const t = useTranslations("Menu");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={pathname === `/${activeOrganizationId}`}
          tooltip={t("settings")}
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          onClick={() => {
            workspaceStorage.clear(activeOrganizationId);
            router.push(`/${activeOrganizationId}`);
          }}
        >
          <Settings size={18} className="mx-2 size-10" />
          {t("settings")}
          <ChevronRight className="ml-auto size-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
