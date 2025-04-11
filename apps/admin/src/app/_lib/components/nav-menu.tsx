import {
  useActiveOrganization,
  useActiveWorkspace,
} from "@/app/_lib/useActiveUrlParams";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "@/navigation";
import {
  BarChart,
  Book,
  Boxes,
  Briefcase,
  Building,
  ChartSpline,
  ChevronRight,
  FolderCog,
  Home,
  type LucideIcon,
  ShoppingCart,
  Tractor,
  Users,
} from "lucide-react";
import type { Route } from "next";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

type NavItem<T extends string> = {
  href: Route<T>;
  label: string;
  icon: LucideIcon;
};

export const NavMenu = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Menu");
  const activeWorkspace = useActiveWorkspace();
  const activeOrganization = useActiveOrganization();
  const baseUrl = `/${activeOrganization}/${activeWorkspace}` as const;
  const pathname = usePathname();
  const query = Object.fromEntries(searchParams.entries());

  // Check if we're on the items section
  const isItemsActive = pathname.startsWith(`${baseUrl}/items`);
  // Check if exactly on the main items page
  const isExactlyOnItemsPage = pathname === `${baseUrl}/items`;
  // Check if in the items section but not on the main items page
  const _isInItemsSectionButNotMainPage =
    isItemsActive && !isExactlyOnItemsPage;

  const navItems: NavItem<
    `${typeof baseUrl}/${string}` | `${typeof baseUrl}`
  >[] = [
    { href: `${baseUrl}`, label: t("home"), icon: Home },
    { href: `${baseUrl}/customers`, label: t("customers"), icon: Home },
    { href: `${baseUrl}/items`, label: t("items"), icon: Boxes },
    { href: `${baseUrl}/orders`, label: t("orders"), icon: ShoppingCart },
    { href: `${baseUrl}/charts`, label: t("analysis"), icon: BarChart },
    { href: `${baseUrl}/taskforce`, label: t("taskforce"), icon: Briefcase },
  ];

  const workspaces = [
    {
      label: t("workspaces"),
      href: `${activeOrganization}?tab=workspaces`,
      icon: Tractor,
    },
    { label: t("users"), href: `${activeOrganization}?tab=users`, icon: Users },
  ];

  const orgNav = [
    { label: t("info"), href: "/profile?tab=info", icon: Book },
    {
      label: t("organizations"),
      href: "/profile?tab=organizations",
      icon: Building,
    },
    { label: t("activity"), href: "/profile?tab=activity", icon: ChartSpline },
    { label: t("settings"), href: "/profile?tab=settings", icon: FolderCog },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("menu")}</SidebarGroupLabel>
      <SidebarMenu>
        {activeWorkspace && activeOrganization
          ? navItems.map((item) => {
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    onClick={() => void router.push(item.href)}
                    isActive={pathname === item.href}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })
          : activeOrganization && !activeWorkspace
            ? workspaces.map((item) => {
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      onClick={() => void router.push(item.href)}
                      isActive={query.tab === item.href.split("tab=")[1]}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })
            : orgNav.map((item) => {
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      onClick={() => void router.push(item.href)}
                      isActive={query.tab === item.href.split("tab=")[1]}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
