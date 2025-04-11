import { useActiveOrganization } from "@/app/_lib/useActiveUrlParams";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { WorkspaceId } from "typeid";
import {
  createWorkspace,
  getWorkspaces,
  updateWorkspace,
} from "./workspaceActions";

export function useWorkspaces() {
  const organizationId = useActiveOrganization();
  const { data, error, isLoading } = useQuery({
    enabled: !!organizationId,
    queryKey: ["workspaces", organizationId],
    queryFn: () => getWorkspaces({ organizationId }),
    throwOnError: true,
  });

  const workspaces = data ?? [];

  return { workspaces, error, isLoading };
}

export function useWorkspace(id?: WorkspaceId | null) {
  const { workspaces } = useWorkspaces();
  return workspaces.find((workspace) => workspace.id === id);
}

export function useCreateWorkspace({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) {
  const queryClient = useQueryClient();
  const organizationId = useActiveOrganization();

  return useMutation({
    mutationFn: (data: { name: string }) =>
      createWorkspace({ organizationId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", organizationId],
      });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Failed to create workspace:", error);
      onError?.(error);
    },
  });
}

export function useUpdateWorkspace({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) {
  const queryClient = useQueryClient();
  const organizationId = useActiveOrganization();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      data,
    }: {
      workspaceId: WorkspaceId;
      data: { name: string };
    }) => {
      return updateWorkspace({ organizationId, workspaceId, data });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspaces", organizationId, variables.workspaceId],
      });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Failed to update workspace:", error);
      onError?.(error);
    },
  });
}