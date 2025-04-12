import { createSelectSchema } from "drizzle-zod";
import { ConversationId, CustomerId, WorkspaceId } from "typeid";
import { z } from "zod";
import { conversations } from "../../db/schema/chat/chat.db";
import { PaginationSchema } from "../customers/customerService";

// Schema for path parameters
export const CustomerConversationParamsSchema = z.object({
  // Assuming organizationId is handled by middleware/parent router
  workspaceId: WorkspaceId,
  customerId: CustomerId,
});

// Basic select schema for a conversation, refine as needed
export const SelectConversationSchema = createSelectSchema(conversations, {
  id: ConversationId,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  // createdBy might be CustomerId or MemberId depending on how chat is initiated
  // We might need to adjust this based on the exact relationship
  createdBy: CustomerId.nullable(), // Assuming customer initiates/owns conversation
  workspaceId: WorkspaceId,
});

// Response schema for a list of conversations
export const ListCustomerConversationsResponseSchema = z.object({
  data: z.array(SelectConversationSchema),
  pagination: PaginationSchema,
});

export type SelectConversationSchema = z.infer<typeof SelectConversationSchema>; 