import { apiClient } from "@/lib/api/apiClient";
import { authClient } from "@/lib/authClient";
import type { BetterFetchOption } from "better-auth/react";
import type { InferRequestType, InferResponseType } from "hono/client";
import type { OrganizationRole } from "shared/auth";
import type {
  InvitationId,
  MemberId,
  OrganizationId,
  WorkspaceId,
} from "typeid";

// Organization API endpoints
const _organizationCreateEndpoint = authClient.organization.create;
const _organizationUpdateEndpoint = authClient.organization.update;
const _organizationDeleteEndpoint = authClient.organization.delete;
const organizationListEndpoint = authClient.organization.list;
const _organizationInviteMemberEndpoint = authClient.organization.inviteMember;
const organizationGetInvitationEndpoint = authClient.organization.getInvitation;
const organizationAcceptInvitationEndpoint =
  authClient.organization.acceptInvitation;
const _organizationSetActiveEndpoint = authClient.organization.setActive;

// Export types using inference
export type Organization = typeof authClient.$Infer.Organization;
export type Member = typeof authClient.$Infer.Member;
export type Invitation = typeof authClient.$Infer.Invitation;

// Request types
export type CreateOrganizationData = {
  name: string;
  slug?: string;
};

export type UpdateOrganizationData = {
  name: string;
};

export type InsertUserSchema = {
  email: string;
  name: string;
  role: OrganizationRole;
};

// Response types
export type OrganizationResponse = Awaited<
  ReturnType<typeof organizationListEndpoint>
>;
export type OrganizationData = NonNullable<
  OrganizationResponse["data"]
>[number];
export type InvitationResponse = Awaited<
  ReturnType<typeof organizationGetInvitationEndpoint>
>;
export type InvitationData = NonNullable<InvitationResponse["data"]>;
export type AcceptInvitationResponse = Awaited<
  ReturnType<typeof organizationAcceptInvitationEndpoint>
>;
export type AcceptInvitationData = NonNullable<
  AcceptInvitationResponse["data"]
>;

// Create a new organization
export const createOrganization = async (data: CreateOrganizationData) => {
  const response = await authClient.organization.create({
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
  });

  if (response.error) {
    throw new Error("Failed to create organization");
  }

  return response.data;
};

export const getActiveOrganization = async (props?: {
  fetchOptions?: BetterFetchOption;
}) => {
  const response = await authClient.organization.getActiveMember({
    fetchOptions: props?.fetchOptions,
  });

  if (response.error) {
    throw new Error("Failed to get active organization");
  }

  return {
    id: response.data?.organizationId,
    memberId: response.data?.id,
    userId: response.data?.userId,
    role: response.data?.role,
  };
};

// Update an existing organization
export const updateOrganization = async (props: {
  organizationId: OrganizationId;
  data: UpdateOrganizationData;
}) => {
  const response = await authClient.organization.update({
    data: {
      name: props.data.name,
    },
    organizationId: props.organizationId,
  });

  if (response.error) {
    throw new Error("Failed to update organization");
  }

  return response.data;
};

// Delete an organization
export const deleteOrganization = async (props: {
  organizationId: OrganizationId;
}) => {
  const response = await authClient.organization.delete({
    organizationId: props.organizationId,
  });

  if (response.error) {
    throw new Error("Failed to delete organization");
  }

  return response.data;
};

// Get all organizations for the current user
export const getOrganizations = async (): Promise<Organization[]> => {
  const response = await authClient.organization.list();

  if (response.error || !response.data) {
    throw new Error("Failed to fetch organizations");
  }

  return response.data;
};

export const getOrganization = async (
  organizationId: OrganizationId,
): Promise<Organization> => {
  const response = await authClient.organization.getFullOrganization({
    query: { organizationId },
  });

  if (response.error || !response.data) {
    throw new Error("Failed to fetch organization");
  }

  return response.data;
};

// Create a new user in the organization
export const createOrganizationUser = async (props: {
  organizationId: OrganizationId;
  data: InsertUserSchema;
}) => {
  const response = await authClient.organization.inviteMember({
    organizationId: props.organizationId,
    email: props.data.email,
    role: props.data.role,
  });

  if (response.error) {
    throw new Error("Failed to create user");
  }

  return response.data;
};

// Get pending invitations for the current user
export const getInvitation = async (props: {
  invitationId: InvitationId;
}): Promise<InvitationData> => {
  const response = await authClient.organization.getInvitation({
    query: { id: props.invitationId },
  });

  if (response.error) {
    throw new Error("Failed to fetch invitations");
  }

  return response.data;
};

// Accept an invitation to join an organization
export const acceptInvitation = async (props: {
  invitationId: string;
}): Promise<AcceptInvitationData> => {
  const response = await authClient.organization.acceptInvitation({
    invitationId: props.invitationId,
  });

  if (response.error) {
    throw new Error("Failed to accept invitation");
  }

  return response.data;
};

// Set the active organization
export const setActiveOrganization = async (props: {
  organizationId: OrganizationId;
}) => {
  const response = await authClient.organization.setActive({
    organizationId: props.organizationId,
  });

  if (response.error) {
    throw new Error("Failed to set active organization");
  }

  return response.data;
};

// Check if user needs onboarding (has no organizations)
export const checkNeedsOnboarding = async (): Promise<boolean> => {
  try {
    const response = await authClient.organization.list();

    if (response.error || !response.data) {
      return true; // Assume they need onboarding if there's an error
    }

    return response.data.length === 0;
  } catch (error) {
    console.error("Failed to check if user needs onboarding:", error);
    return true; // Assume they need onboarding if there's an error
  }
};
