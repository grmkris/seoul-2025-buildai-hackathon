import { relations } from "drizzle-orm";
import { conversationsTable, messagesTable, usersTable } from "./chat.db";

export const conversationsRelations = relations(
  conversationsTable,
  ({ one, many }) => ({
    createdBy: one(usersTable, {
      fields: [conversationsTable.createdBy],
      references: [usersTable.id],
      relationName: "conversationCreatedBy",
    }),
    messages: many(messagesTable),
  }),
);

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  conversation: one(conversationsTable, {
    fields: [messagesTable.conversationId],
    references: [conversationsTable.id],
  }),
  createdBy: one(usersTable, {
    fields: [messagesTable.createdBy],
    references: [usersTable.id],
    relationName: "messageCreatedBy",
  }),
}));
