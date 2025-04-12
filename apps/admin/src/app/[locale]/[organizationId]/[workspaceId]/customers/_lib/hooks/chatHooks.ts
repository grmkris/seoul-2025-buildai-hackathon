import {
  useActiveOrganization,
  useActiveWorkspace,
} from "@/app/_lib/useActiveUrlParams";
import { useQuery } from "@tanstack/react-query";
import type { ConversationId, CustomerId } from "typeid";
import {
  type ListCustomerConversationsQuery,
  getCustomerConversations,
  type ListMessagesQuery,
  getConversationMessages,
} from "./chatActions";

export function useCustomerConversations(
  customerId: CustomerId | undefined,
  params: ListCustomerConversationsQuery = {},
) {
  const workspaceId = useActiveWorkspace();
  return useQuery({
    // Only run query if workspaceId and customerId are available
    enabled: !!workspaceId && !!customerId,
    queryKey: ["customerConversations", workspaceId, customerId, params],
    queryFn: () => {
      if (!workspaceId || !customerId) {
        throw new Error("Workspace ID and Customer ID are required");
      }
      return getCustomerConversations({ workspaceId, customerId, params });
    },
    // Optional: Add staleTime or other react-query options if needed
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useConversationMessages(
  conversationId: ConversationId | undefined,
  params: ListMessagesQuery = {},
) {
  const organizationId = useActiveOrganization();
  const workspaceId = useActiveWorkspace();
  return useQuery({
    // Only run if all IDs are present
    enabled: !!organizationId && !!workspaceId && !!conversationId,
    queryKey: [
      "conversationMessages",
      organizationId,
      workspaceId,
      conversationId,
      params,
    ],
    queryFn: () => {
      if (!organizationId || !workspaceId || !conversationId) {
        throw new Error("Organization, Workspace, and Conversation IDs are required");
      }
      return getConversationMessages({
        organizationId,
        workspaceId,
        conversationId,
        params,
      });
    },
    // Optional: Add staleTime or other react-query options if needed
    // staleTime: 1 * 60 * 1000, // 1 minute
  });
} 