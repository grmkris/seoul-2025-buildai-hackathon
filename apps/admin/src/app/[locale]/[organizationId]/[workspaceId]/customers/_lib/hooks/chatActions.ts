import {
  customerConversationClient,
  messageClient,
} from "@/lib/api/apiClient";
import type { InferRequestType, InferResponseType } from "hono/client";
import type {
  ConversationId,
  CustomerId,
  MemberId,
  MessageId,
  WorkspaceId,
} from "typeid";
import { z } from "zod";

// Define the endpoint using the client
const customerConversationsGetEndpoint =
  customerConversationClient.admin.workspaces[ ":workspaceId" ].customers[
    ":customerId"
  ].conversations.$get;

// Infer types
export type ListCustomerConversationsParams = InferRequestType<
  typeof customerConversationsGetEndpoint
>["param"];
export type ListCustomerConversationsQuery = InferRequestType<
  typeof customerConversationsGetEndpoint
>["query"];
export type ListCustomerConversationsResponse = InferResponseType<
  typeof customerConversationsGetEndpoint,
  200
>;

// Define Conversation type based on response (adjust if needed)
export type Conversation = ListCustomerConversationsResponse["data"][number];

// Action function
export const getCustomerConversations = async (props: {
  workspaceId: WorkspaceId;
  customerId: CustomerId;
  params?: ListCustomerConversationsQuery;
}) => {
  const response = await customerConversationsGetEndpoint({
    param: {
      workspaceId: props.workspaceId,
      customerId: props.customerId,
    },
    query: props.params ?? {},
    header: {},
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error:", errorText);
    throw new Error(
      `Failed to get customer conversations (status: ${response.status})`,
    );
  }
  return response.json();
};

// --- Conversation Messages ---

// Define the endpoint using the messageClient
const messagesGetEndpoint =
  messageClient.conversations[":conversationId"].messages.$get;

// Infer types for messages
export type ListMessagesQuery = InferRequestType<typeof messagesGetEndpoint>["query"];
export type ListMessagesResponse = InferResponseType<typeof messagesGetEndpoint, 200>;

// Define Message type based on response (adjust if needed)
// The response is an array of messages, so we take the element type
export type Message = ListMessagesResponse[number];

// Action function to get messages for a conversation
export const getConversationMessages = async (props: {
  // We need organizationId and workspaceId for the param structure
  // even though the API path only uses conversationId directly
  // This is based on how the messageClient types are inferred
  organizationId: string; // Assuming OrganizationId type, adjust if needed
  workspaceId: WorkspaceId;
  conversationId: ConversationId;
  params?: ListMessagesQuery;
}) => {
  const response = await messagesGetEndpoint({
    param: {
      organizationId: props.organizationId,
      workspaceId: props.workspaceId,
      conversationId: props.conversationId,
    },
    query: props.params ?? {},
    header: {},
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error fetching messages:", errorText);
    throw new Error(
      `Failed to get conversation messages (status: ${response.status})`,
    );
  }
  return response.json();
}; 