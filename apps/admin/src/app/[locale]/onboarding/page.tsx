"use client";

import { useCurrentUser } from "@/app/[locale]/auth/authHooks";
import { OrganizationSetup } from "@/app/[locale]/onboarding/organization-setup";
import { useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useWorkspaces } from "../[organizationId]/[workspaceId]/_lib/hooks/workspaceHooks";
import { useOrganizations } from "../[organizationId]/_lib/hooks/organizationsHooks";

export default function OnboardingPage() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const { organizations, isLoading: isOrgsLoading } = useOrganizations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("invitationId");

  // If the user has at least one org, check if they have any workspaces
  const selectedOrgId = organizations?.[0]?.id;
  const { workspaces, isLoading: isWorkspacesLoading } = useWorkspaces();
  const hasWorkspaces = workspaces?.length > 0;

  // Check if user already has an organization
  useEffect(() => {
    if (
      !(isUserLoading || isOrgsLoading || isWorkspacesLoading) &&
      user &&
      organizations.length > 0
    ) {
      // If they already have an org and workspace, redirect to it
      // Don't redirect if there's an invitation ID - allow them to join a new org
      if (!invitationId && organizations[0] && organizations[0].id) {
        // If the user has at least one workspace, redirect to the organization page
        if (hasWorkspaces) {
          router.push(`/${organizations[0].id}?tab=workspaces`);
        }
      }
    }
  }, [
    user,
    isUserLoading,
    organizations,
    isOrgsLoading,
    isWorkspacesLoading,
    router,
    invitationId,
    hasWorkspaces,
  ]);

  if (
    isUserLoading ||
    isOrgsLoading ||
    (selectedOrgId && isWorkspacesLoading)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-10 w-10 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (!user) {
    // If there's an invitation, redirect to login with invitation ID
    if (invitationId) {
      router.push(`/login?invitationId=${invitationId}`);
    } else {
      router.push("/login");
    }
    return null;
  }

  // Only show setup if user has no organizations or has an invitation to join
  // Or if they have an organization but no workspaces
  if (organizations.length > 0 && !invitationId && hasWorkspaces) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-10 w-10 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Welcome to Zdrava Kosara
      </h1>
      <OrganizationSetup user={user} />
    </div>
  );
}
