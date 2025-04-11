"use client";

import { ChevronRight, ChevronsUpDown, LogOut, User } from "lucide-react";

import { useCurrentUser } from "@/app/[locale]/auth/authHooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";

export function NavUser(props: { onLogout: () => void }) {
  const { onLogout } = props;
  const { isMobile } = useSidebar();
  const { user, isLoading } = useCurrentUser();
  const t = useTranslations("Menu");
  const _locale = useLocale();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const UserSection = (props: { className?: string }) => (
    <div className={cn("flex items-center gap-1.5 text-xs", props.className)}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-teal-500 dark:bg-teal-800">
        <User color="white" size={18} />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate">{user?.user.email}</span>
      </div>
    </div>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={t("profile")}
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserSection />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <UserSection className="px-1 py-2" />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex cursor-pointer items-center justify-between text-xs">
              <Link href="/profile?tab=info">{t("viewProfile")}</Link>
              <ChevronRight size={16} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={onLogout}
              className="flex cursor-pointer items-center justify-between text-xs text-red-400 hover:text-red-400!"
            >
              {t("logOut")}
              <LogOut size={16} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
