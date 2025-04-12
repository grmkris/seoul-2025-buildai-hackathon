import { useQuery } from "@tanstack/react-query";
import { getConversation } from "./actions";
import type { ConversationId } from "typeid";
import { apiClient } from "./apiClient";

export const useConversation = (props: {
  conversationId: ConversationId;
}) => {
  const { conversationId } = props;
  const { data, isLoading, error } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation({ apiClient, conversationId }),
  });
  return { data, isLoading, error };
};