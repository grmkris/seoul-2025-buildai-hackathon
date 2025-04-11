"use client";
import { useParams } from "next/navigation";
import type { OrganizationId, WorkspaceId } from "typeid";

export const useActiveOrganization = () => {
  const params = useParams();
  return params?.organizationId as OrganizationId;
};

export const useActiveWorkspace = () => {
  const params = useParams();
  return params?.workspaceId as WorkspaceId;
};
