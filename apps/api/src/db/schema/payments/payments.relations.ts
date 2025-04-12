import { relations } from "drizzle-orm";
import { paymentIntents } from "./payments.db";
import { conversations } from "../chat/chat.db";
import { customersTable } from "../schema.db";

export const paymentIntentsRelations = relations(paymentIntents, ({ one }) => ({
  customer: one(customersTable, {
    fields: [paymentIntents.customerId],
    references: [customersTable.id],
  }),
  conversation: one(conversations, {
    fields: [paymentIntents.conversationId],
    references: [conversations.id],
  }),
}));
