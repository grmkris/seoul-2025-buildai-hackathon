"use client";

import {
  useWorkspaces,
} from "@/app/[locale]/[organizationId]/[workspaceId]/_lib/hooks/workspaceHooks";
import { useOrganizations } from "@/app/[locale]/[organizationId]/_lib/hooks/organizationsHooks";
import { signOut } from "@/app/[locale]/auth/authActions";
import {
  useActiveOrganization,
  useActiveWorkspace,
} from "@/app/_lib/useActiveUrlParams";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import {
  BarChart3,
  Briefcase,
  CheckSquare,
  Command,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  PlusCircle,
  Settings,
  ShoppingCart,
  Sparkles,
  Truck,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function CommandButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        className="fixed right-4 bottom-4 h-10 w-10 rounded-full p-0 sm:h-10 sm:w-10 md:right-8 md:bottom-8"
        onClick={() => setOpen(true)}
      >
        <Command className="h-5 w-5" />
        <span className="sr-only">Open command palette</span>
      </Button>
      <CommandPalette open={open} setOpen={setOpen} />
    </>
  );
}

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const t = useTranslations("CommandPalette");
  const router = useRouter();
  const { workspaces } = useWorkspaces();
  const { organizations } = useOrganizations();
  const activeOrganization = useActiveOrganization();
  const activeWorkspace = useActiveWorkspace();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // @ts-expect-error - TODO: fix this
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen],
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t("searchPlaceholder")} />
      <CommandList>
        <CommandEmpty>{t("noResults")}</CommandEmpty>

        {/* AI Assistant section */}
        {activeWorkspace && (
          <CommandGroup heading="AI Assistant">
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push(
                    `/${activeOrganization}/${activeWorkspace}/chat/new`,
                  ),
                )
              }
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>New Conversation</span>
            </CommandItem>

            {/* Direct AI query from command palette */}
            <CommandItem
              onSelect={() => {
                setOpen(false);
                // Get text from command input
                const inputElement = document.querySelector(
                  "[data-cmdk-input]",
                ) as HTMLInputElement;
                const query = inputElement?.value;
                if (query && query.trim().length > 0) {
                  router.push(
                    `/${activeOrganization}/${activeWorkspace}/chat/new?prompt=${encodeURIComponent(query)}`,
                  );
                }
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Ask AI this question</span>
            </CommandItem>
          </CommandGroup>
        )}

        {activeWorkspace && (
          <CommandGroup heading={t("workspace")}>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push(`/${activeOrganization}/${activeWorkspace}`),
                )
              }
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>{t("dashboard")}</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push(
                    `/${activeOrganization}/${activeWorkspace}/orders`,
                  ),
                )
              }
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>{t("orders")}</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push(
                    `/${activeOrganization}/${activeWorkspace}/customers`,
                  ),
                )
              }
            >
              <Users className="mr-2 h-4 w-4" />
              <span>{t("customers")}</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push(
                    `/${activeOrganization}/${activeWorkspace}/inventory`,
                  ),
                )
              }
            >
              <Truck className="mr-2 h-4 w-4" />
              <span>{t("inventory")}</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push(
                    `/${activeOrganization}/${activeWorkspace}/charts`,
                  ),
                )
              }
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>{t("analytics")}</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  router.push(
                    `/${activeOrganization}/${activeWorkspace}/taskforce`,
                  ),
                )
              }
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              <span>{t("tasks")}</span>
            </CommandItem>
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading={t("organizations")}>
          {organizations?.map((org) => (
            <CommandItem
              key={org.id}
              onSelect={() => runCommand(() => router.push(`/${org.id}`))}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              <span>{org.name}</span>
            </CommandItem>
          ))}
          <CommandItem
            onSelect={() => runCommand(() => router.push("/onboarding"))}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>{t("createNewOrganization")}</span>
          </CommandItem>
        </CommandGroup>

        {workspaces?.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t("workspaces")}>
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  onSelect={() =>
                    runCommand(() =>
                      router.push(`/${activeOrganization}/${workspace.id}`),
                    )
                  }
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>{workspace.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />

        <CommandGroup heading={t("account")}>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings/profile"))}
          >
            <User className="mr-2 h-4 w-4" />
            <span>{t("profile")}</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>{t("settings")}</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => handleSignOut())}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("signOut")}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
