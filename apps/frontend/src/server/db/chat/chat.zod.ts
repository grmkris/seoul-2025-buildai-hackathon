import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { ConversationId, MessageId, UserId } from "../typeid";
import { conversationsTable, messagesTable } from "./chat.db"; // Assuming tables are exported from chat.db.ts
import type { Message } from "ai";

export const AGENT_LEVELS = ["pic", "sheet", "level"] as const;
export const AgentLevel = z.enum(AGENT_LEVELS);
export type AgentLevel = z.infer<typeof AgentLevel>;

/**
 * /**
A JSON value can be a string, number, boolean, object, array, or null.
JSON values can be serialized and deserialized by the JSON.stringify and JSON.parse methods.
 */
export const MessageSchema = z.custom<Omit<Message, "data" | "annotations">>();

// Schemas for Conversations
export const SelectConversationSchema = createSelectSchema(conversationsTable, {
  id: ConversationId,
  createdAt: z.coerce.date(),
  createdBy: UserId,
});

export const InsertConversationSchema = z.object({
  title: z.string().min(1).max(255),
});
export type SelectConversationSchema = z.infer<typeof SelectConversationSchema>;
export type InsertConversationSchema = z.infer<typeof InsertConversationSchema>;

// Message Schemas
export const SelectMessageSchema = createSelectSchema(messagesTable, {
  id: MessageId,
  conversationId: ConversationId,
  createdAt: z.coerce.date(),
  createdBy: UserId,
});
export type SelectMessageSchema = z.infer<typeof SelectMessageSchema>;

export const InsertMessageSchema = z.object({
  conversationId: ConversationId, // notNull
  message: MessageSchema, // notNull
});
export type InsertMessageSchema = z.infer<typeof InsertMessageSchema>;
