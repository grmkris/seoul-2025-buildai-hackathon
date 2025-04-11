import {
  type InsertUserSchema,
  createOrganizationUser,
} from "@/app/[locale]/[organizationId]/_lib/hooks/organizationActions";
import { useActiveOrganization } from "@/app/_lib/useActiveUrlParams";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MemberId, OrganizationId } from "typeid";
import {
  getOrganizationMembers,
  removeOrganizationMember,
  updateUserRole,
} from "./memberActions";

export function useOrganizationMembers() {
  const organizationId = useActiveOrganization();
  const { data, error, isLoading } = useQuery({
    enabled: !!organizationId,
    queryKey: ["members", organizationId],
    queryFn: () => getOrganizationMembers({ organizationId }),
    throwOnError: true,
  });

  const members = data ?? [];

  return { members, error, isLoading };
}

export function useOrganizationMember(id?: MemberId | null) {
  const { members } = useOrganizationMembers();
  return members.find((member) => member.id === id);
}

export function useCreateMember({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) {
  const queryClient = useQueryClient();
  const organizationId = useActiveOrganization();

  return useMutation({
    mutationFn: (data: InsertUserSchema) =>
      createOrganizationUser({ organizationId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", organizationId] });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Failed to create member:", error);
      onError?.(error);
    },
  });
}

export function useDeleteMember({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();
  const organizationId = useActiveOrganization();

  return useMutation({
    mutationFn: (memberId: MemberId) =>
      removeOrganizationMember({
        organizationId,
        memberId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", organizationId] });
      onSuccess?.();
    },
    onError,
  });
}

export function useUpdateMemberRole({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) {
  const queryClient = useQueryClient();
  const organizationId = useActiveOrganization();

  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members", organizationId] });
      queryClient.invalidateQueries({
        queryKey: ["members", organizationId, variables.memberId],
      });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Failed to update member role:", error);
      onError?.(error);
    },
  });
}
