"use client";

import {
  useCurrentUser,
  useLogout,
  useOrganizations,
} from "@/app/[locale]/auth/authHooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter } from "@/navigation";
import { organizationStorage, workspaceStorage } from "@/utils/storage";
import { AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { OrganizationId } from "typeid";

export function DashboardLoader({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const _logout = useLogout();
  const organizations = useOrganizations();

  useEffect(() => {
    if (!user.user) {
      // Wait for user data to load
      return;
    }

    if (!organizations.data?.length) {
      // User has no organizations
      return;
    }

    const firstOrgId = organizations.data[0]?.id;
    const lastOrganizationId = organizationStorage.get();
    const currentOrgId = params?.organizationId as OrganizationId;

    // Check if we're on a path that should have organization context
    const isOrganizationRoute =
      pathname.split("/").length >= 2 &&
      !["profile", "terms", "privacy", "auth"].some((path) =>
        pathname.includes(path),
      );

    if (isOrganizationRoute) {
      if (!params?.organizationId || pathname === "/") {
        // If no organization in URL, redirect to last used or first available
        const targetOrgId = lastOrganizationId || firstOrgId;
        router.replace(`/${targetOrgId}`);
      } else {
        // Save current organization
        organizationStorage.save(currentOrgId);

        // Handle workspace redirect if needed
        if (!params?.workspaceId) {
          const lastWorkspaceId = workspaceStorage.get(currentOrgId);
          if (lastWorkspaceId) {
            router.replace(`/${currentOrgId}/${lastWorkspaceId}`);
          }
        }
      }
    }
  }, [user.user, params, pathname, router, organizations.data]);

  // Show skeleton while user data is loading
  if (!user.user) {
    return <DashboardSkeleton />;
  }

  return <>{children}</>;
}

function DashboardSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Skeleton className="h-32 w-32" />
    </div>
  );
}
