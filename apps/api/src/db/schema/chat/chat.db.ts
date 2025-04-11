import type { Message } from "ai";
import { index, jsonb, pgTable, varchar } from "drizzle-orm/pg-core";
import { type ConversationId, type MessageId, typeIdGenerator } from "typeid";
import { member } from "../orgs/orgs.db";
import { workspaces } from "../orgs/orgs.db";
import { createFullEntityFields, typeId } from "../utils.db";

// Conversations table
export const conversations = pgTable(
  "conversations",
  {
    id: typeId("conversation", "id")
      .primaryKey()
      .$defaultFn(() => typeIdGenerator("conversation"))
      .$type<ConversationId>(),
    title: varchar("title", { length: 255 }).notNull(),
    ...createFullEntityFields(member, workspaces),
  },
  (t) => [index("conversation_workspace_idx").on(t.workspaceId)],
);

// Messages table
export const messages = pgTable(
  "messages",
  {
    id: typeId("message", "id")
      .primaryKey()
      .$defaultFn(() => typeIdGenerator("message"))
      .$type<MessageId>(),
    conversationId: typeId("conversation", "conversation_id")
      .notNull()
      .references(() => conversations.id)
      .$type<ConversationId>(),
    message: jsonb("message").$type<Message>().notNull(),
    ...createFullEntityFields(member, workspaces),
  },
  (t) => [
    index("message_conversation_idx").on(t.conversationId),
    index("message_workspace_idx").on(t.workspaceId),
  ],
);
