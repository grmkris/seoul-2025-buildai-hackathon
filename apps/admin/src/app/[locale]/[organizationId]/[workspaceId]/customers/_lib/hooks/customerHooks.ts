import {
  useActiveOrganization,
  useActiveWorkspace,
} from "@/app/_lib/useActiveUrlParams";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CustomerId } from "typeid";
import { toast } from "sonner";
import {
  type Customer,
  type InsertCustomerSchema,
  type ListCustomersSchema,
  createCustomer,
  deleteCustomer,
  editCustomer,
  getCustomer,
  getCustomers,
} from "./customerActions";

export function useCustomers(params: ListCustomersSchema = {}) {
  const organizationId = useActiveOrganization();
  const workspaceId = useActiveWorkspace();
  return useQuery({
    enabled: !!organizationId && !!workspaceId,
    queryKey: ["customers", organizationId, workspaceId, params],
    queryFn: () => getCustomers({ organizationId, workspaceId, params }),
  });
}

export function useCustomer(id: CustomerId | undefined) {
  const organizationId = useActiveOrganization();
  const workspaceId = useActiveWorkspace();
  const { data, error, isLoading } = useQuery({
    enabled: !!id && !!organizationId && !!workspaceId,
    queryKey: ["customer", organizationId, workspaceId, id],
    queryFn: () => {
      if (!id) throw new Error("Customer ID is required");
      return getCustomer({ organizationId, workspaceId, id });
    },
  });

  return { customer: data, error, isLoading };
}

export function useCreateCustomer({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: Customer) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();
  const organizationId = useActiveOrganization();
  const workspaceId = useActiveWorkspace();

  const mutation = useMutation({
    mutationFn: (data: InsertCustomerSchema) =>
      createCustomer({ organizationId, workspaceId, data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["customers", organizationId, workspaceId],
      });
      toast.success("Customer created successfully");
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create customer: ${error.message}`);
      onError?.(error);
    },
  });

  return mutation;
}

export function useDeleteCustomer(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  const organizationId = useActiveOrganization();
  const workspaceId = useActiveWorkspace();

  return useMutation({
    mutationFn: (id: CustomerId) =>
      deleteCustomer({ organizationId, workspaceId, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers", organizationId, workspaceId],
      });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

export function useEditCustomer(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  const organizationId = useActiveOrganization();
  const workspaceId = useActiveWorkspace();

  return useMutation({
    mutationFn: (props: { id: CustomerId; data: InsertCustomerSchema }) =>
      editCustomer({ organizationId, workspaceId, ...props }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers", organizationId, workspaceId],
      });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}