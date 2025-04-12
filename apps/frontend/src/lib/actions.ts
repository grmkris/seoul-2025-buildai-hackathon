import type { ConversationId } from "typeid";
import type { ApiClient } from "./apiClient";
export const getConversation = async (props: {
  apiClient: ApiClient;
  conversationId: ConversationId;
}) => {
  const response = await props.apiClient.public.$get({
    param: { conversationId: props.conversationId },
  });
  return response.json();
};
