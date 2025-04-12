import type { ConversationId } from "typeid";
import { publicClient } from "./api/apiClient";

export const getConversation = async (props: {
  conversationId: ConversationId;
}) => {
  const response = await publicClient.public.conversations[":conversationId"][":conversationId"].$get({
    param: { conversationId: props.conversationId },
  });

  if (!response.ok) {
    throw new Error("Failed to get conversation");
  }

  return response.json();
};
