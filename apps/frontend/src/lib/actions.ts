import type { ConversationId, PaymentIntentId, WorkspaceId } from "typeid";
import { publicClient } from "./api/apiClient";

export const getConversation = async (props: {
  conversationId: ConversationId;
}) => {
  // Using the hc client for consistency, assuming publicClient has similar structure
  // or replace with the actual publicClient call if preferred
  const response = await publicClient.public.conversations[":conversationId"].$get({
    param: { conversationId: props.conversationId },
  });

  if (!response.ok) {
    console.error("Failed to get conversation:", await response.text());
    throw new Error(`Failed to get conversation: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
};

export const initializeWidget = async (props: {
  walletAddress: string;
  workspaceId: WorkspaceId;
}) => {
  const response = await publicClient.public.initialize.$post({
    json: {
      walletAddress: props.walletAddress,
      workspaceId: props.workspaceId,
    },
  });

  if (!response.ok) {
    console.error("Failed to initialize widget:", await response.text());
    throw new Error(`Failed to initialize widget: ${response.statusText}`);
  }

  return response.json();
};

export const getConversations = async () => {
  const response = await publicClient.public.conversations.$get();

  if (!response.ok) {
    console.error("Failed to get conversations:", await response.text());
    throw new Error(`Failed to get conversations: ${response.statusText}`);
  }

  return response.json();
};

export const getPaymentIntent = async (props: {
  paymentIntentId: PaymentIntentId;
}) => {
  const response = await publicClient.public.payments[":paymentIntentId"].$get({
    param: { paymentIntentId: props.paymentIntentId },
  });

  if (!response.ok) {
    console.error("Failed to get payment intent:", await response.text());
    throw new Error(`Failed to get payment intent: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
};