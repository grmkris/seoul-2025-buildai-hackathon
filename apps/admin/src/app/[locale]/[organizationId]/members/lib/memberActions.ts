import { authClient } from "@/lib/authClient";
import { OrganizationRole } from "@/lib/utils";
import { MemberId, OrganizationId , UserId } from "typeid";
import { z } from "zod";

export const updateUserRole = async (props: {
  organizationId: OrganizationId;
  memberId: MemberId;
  role: OrganizationRole;
}) => {
  const response = await authClient.organization.updateMemberRole(props);

  if (response.error) {
    throw new Error("Failed to update user role");
  }

  return response.data;
};

export const removeOrganizationMember = async (props: {
  organizationId: OrganizationId;
  memberId: MemberId;
}) => {
  const response = await authClient.organization.removeMember({
    memberIdOrEmail: props.memberId,
    organizationId: props.organizationId,
  });

  if (response.error) {
    throw new Error("Failed to delete user");
  }

  return response.data;
};

export const getOrganizationMembers = async (props: {
  organizationId: OrganizationId;
}) => {
  console.log("getOrganizationMembers", props.organizationId);
  const response = await authClient.organization.getFullOrganization({
    query: {
      organizationId: props.organizationId,
    },
  });

  const members = response.data?.members;
  if (response.error || !members) {
    throw new Error("Failed to fetch users");
  }
  return members.map((member) => ({
    ...member,
    id: MemberId.parse(member.id),
    userId: UserId.parse(member.userId),
    organizationId: OrganizationId.parse(member.organizationId),
    role: OrganizationRole.parse(member.role),
  }));
};

export type Member = Awaited<
  ReturnType<typeof authClient.organization.getFullOrganization>
>[number];
