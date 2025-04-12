import { relations } from "drizzle-orm";
import { member } from "../orgs/orgs.db"; // Adjusted path
import { workspaces } from "../orgs/orgs.db"; // Adjusted path
import { conversations, messages } from "./chat.db";
import { paymentIntents } from "../payments/payments.db";
import { customersTable } from "../customers/customers.db";

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    createdByCustomer: one(customersTable, {
      fields: [conversations.createdBy],
      references: [customersTable.id],
      relationName: "conversationCreatedBy",
    }),
    updatedByCustomer: one(customersTable, {
      fields: [conversations.updatedBy],
      references: [customersTable.id],
      relationName: "conversationUpdatedBy",
    }),
    workspace: one(workspaces, {
      fields: [conversations.workspaceId],
      references: [workspaces.id],
    }),
    messages: many(messages),
    paymentIntents: many(paymentIntents),
  }),
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  createdByMember: one(member, {
    fields: [messages.createdBy],
    references: [member.id],
    relationName: "messageCreatedBy",
  }),
  updatedByMember: one(member, {
    fields: [messages.updatedBy],
    references: [member.id],
    relationName: "messageUpdatedBy",
  }),
  workspace: one(workspaces, {
    fields: [messages.workspaceId],
    references: [workspaces.id],
  }),
}));
