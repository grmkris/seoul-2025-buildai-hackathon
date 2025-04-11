import { useRouter } from "@/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InvitationId, OrganizationId } from "typeid";
import {
  type InsertUserSchema,
  acceptInvitation,
  createOrganization,
  createOrganizationUser,
  deleteOrganization,
  getActiveOrganization,
  getInvitation,
  getOrganization,
  getOrganizations,
  setActiveOrganization,
  updateOrganization,
} from "./organizationActions";
import type { BetterFetchOption } from "better-auth/react";

export function useOrganizations() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
    throwOnError: true,
  });

  const organizations = data ?? [];

  return { organizations, error, isLoading };
}

export function useOrganization(id?: OrganizationId | null) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["organization", id],
    enabled: !!id,
    queryFn: () => {
      if (!id) {
        throw new Error("Organization ID is required");
      }
      return getOrganization(id);
    },
  });

  return { organization: data, error, isLoading };
}

export function useInvitation(invitationId: InvitationId) {
  return useQuery({
    queryKey: ["invitation", invitationId],
    queryFn: () => getInvitation({ invitationId }),
  });
}

export function useAcceptInvitation({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ReturnType<typeof acceptInvitation> extends Promise<infer T>
      ? T
      : never,
  ) => void;
  onError?: (error: unknown) => void;
} = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["invitations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
      if (data.member?.organizationId) {
        router.push(`/${data.member.organizationId}`);
      }
      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      console.error("Failed to accept invitation:", error);
      onError?.(error);
    },
  });
}

export function useSetActiveOrganization({
  onSuccess,
  onError,
}: {
  onSuccess?: (organizationId: OrganizationId) => void;
  onError?: (error: unknown) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setActiveOrganization,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["activeMember"],
      });
      onSuccess?.(variables.organizationId);
    },
    onError: (error: unknown) => {
      console.error("Failed to set active organization:", error);
      onError?.(error);
    },
  });
}

export const useActiveOrganization = (props?: {
  fetchOptions?: BetterFetchOption;
}) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["activeOrganization"],
    queryFn: () => getActiveOrganization(props),
  });

  return { activeOrganization: data, error, isLoading };
};

export function useCreateOrganization({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ReturnType<typeof createOrganization> extends Promise<infer T>
      ? T
      : never,
  ) => void;
  onError?: (error: unknown) => void;
} = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { name: string }) => createOrganization(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      try {
        if (data?.id) {
          const orgId = data.id as OrganizationId;

          await setActiveOrganization({
            organizationId: orgId,
          });

          router.push(`/${orgId}?tab=workspaces`);
        }
      } catch (error) {
        console.error("Error after organization creation:", error);
      }

      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      console.error("Failed to create organization:", error);
      onError?.(error);
    },
  });
}

export function useUpdateOrganization({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      organizationId,
      data,
    }: {
      organizationId: OrganizationId;
      data: { name: string };
    }) => {
      return updateOrganization({ organizationId, data });
    },
    onSuccess: (_, _variables) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Failed to update organization:", error);
      onError?.(error);
    },
  });
}

export function useDeleteOrganization({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: OrganizationId) =>
      deleteOrganization({ organizationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Failed to delete organization:", error);
      onError?.(error);
    },
  });
}

export function useCreateOrganizationUser(
  organizationId: OrganizationId,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  } = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InsertUserSchema) =>
      createOrganizationUser({ organizationId, data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["members", organizationId],
      });
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Failed to create user:", error);
      onError?.(error);
    },
  });
}

export function useNeedsOnboarding() {
  const { organizations, isLoading } = useOrganizations();

  return {
    needsOnboarding: !isLoading && organizations.length === 0,
    isLoading,
  };
}
