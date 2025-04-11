import { authClient } from "@/lib/authClient";
import { useRouter } from "@/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrganizationRole } from "@/auth.schema";
import {
  checkNeedsOnboarding,
  getOrganizations,
} from "../[organizationId]/_lib/hooks/organizationActions";
import {
  changeUserPassword,
  getCurrentUser,
  loginWithEmail,
  loginWithUsername,
  logoutUser,
  registerWithEmail,
  registerWithUsername,
} from "./authActions";

export function useCurrentUser() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}

export function useChangeUserPassword({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeUserPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Failed to change user password:", error);
      onError?.(error);
    },
  });
}

export const useIsAdmin = () => {
  const client = authClient.useActiveMember();
  return {
    ...client,
    data: client.data
      ? {
          role: OrganizationRole.nullish().parse(client.data.role),
        }
      : null,
  };
};

// TODO make this typed better
export const useRole = () => {
  const client = authClient.useActiveMember();
  return {
    ...client,
    data: client.data
      ? {
          role: OrganizationRole.nullish().parse(client.data.role),
        }
      : null,
  };
};

export const useOrganizations = authClient.useListOrganizations;

export type Organization = typeof authClient.$Infer.Organization;

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
};

// Hook for email login
export const useLoginWithEmail = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: loginWithEmail,
    onSuccess: async () => {
      await queryClient.invalidateQueries();

      // After login, check if user has organizations
      try {
        const needsOnboarding = await checkNeedsOnboarding();

        if (needsOnboarding) {
          // User needs onboarding
          router.push("/onboarding");
        } else {
          // User has organizations, get them and redirect to the first one
          const organizations = await getOrganizations();
          if (organizations[0]) {
            router.push(`/${organizations[0].id}?tab=workspaces`);
          } else {
            router.push("/onboarding");
          }
        }
      } catch (error) {
        console.error("Error checking organizations after login:", error);
        // If error occurs, redirect to onboarding
        router.push("/onboarding");
      }

      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Failed to login with email:", error);
      onError?.(error);
    },
  });
};

// Hook for username login
export const useLoginWithUsername = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: loginWithUsername,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });

      // After login, check if user has organizations
      try {
        const needsOnboarding = await checkNeedsOnboarding();

        if (needsOnboarding) {
          // User needs onboarding
          router.push("/onboarding");
        } else {
          // User has organizations, get them and redirect to the first one
          const organizations = await getOrganizations();
          if (organizations[0]) {
            router.push(`/${organizations[0].id}?tab=workspaces`);
          } else {
            router.push("/onboarding");
          }
        }
      } catch (error) {
        console.error("Error checking organizations after login:", error);
        // If error occurs, redirect to onboarding
        router.push("/onboarding");
      }

      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Failed to login with username:", error);
      onError?.(error);
    },
  });
};

// Hook for email registration
export const useRegisterWithEmail = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: registerWithEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
      router.push("/onboarding");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Failed to register with email:", error);
      onError?.(error);
    },
  });
};

// Hook for username registration
export const useRegisterWithUsername = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: registerWithUsername,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
      router.push("/onboarding");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Failed to register with username:", error);
      onError?.(error);
    },
  });
};

export const useActiveMember = authClient.useActiveMember;
