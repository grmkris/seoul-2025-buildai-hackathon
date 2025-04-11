import { MessageSchema } from "ai";
import { createSelectSchema } from "drizzle-zod";
import { ConversationId, MemberId, MessageId, WorkspaceId } from "typeid";
import { z } from "zod";
import { conversations, messages } from "./chat.db"; // Assuming tables are exported from chat.db.ts

// Schemas for Conversations
export const SelectConversationSchema = createSelectSchema(conversations, {
  id: ConversationId,
  workspaceId: WorkspaceId,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: MemberId,
  updatedBy: MemberId,
});
export const InsertConversationSchema = z.object({
  title: z.string().min(1).max(255),
});
export type SelectConversationSchema = z.infer<typeof SelectConversationSchema>;
export type InsertConversationSchema = z.infer<typeof InsertConversationSchema>;

// Message Schemas
export const SelectMessageSchema = createSelectSchema(messages, {
  id: MessageId,
  conversationId: ConversationId,
  message: MessageSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: MemberId,
  updatedBy: MemberId, // Added updatedBy based on createFullEntityFields
  workspaceId: WorkspaceId,
});
export type SelectMessageSchema = z.infer<typeof SelectMessageSchema>;

export const InsertMessageSchema = z.object({
  conversationId: ConversationId, // notNull
  message: MessageSchema, // notNull
});
export type InsertMessageSchema = z.infer<typeof InsertMessageSchema>;
