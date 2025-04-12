import { relations } from "drizzle-orm";
import { member } from "../orgs/orgs.db"; // Adjusted path
import { workspaces } from "../orgs/orgs.db"; // Adjusted path
import { conversations, messages } from "./chat.db";
import { user } from "../auth/auth.db"; // Corrected import name
import { paymentIntents } from "../payments/payments.db";

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    createdByMember: one(member, {
      fields: [conversations.createdBy],
      references: [member.id],
      relationName: "conversationCreatedBy",
    }),
    updatedByMember: one(member, {
      fields: [conversations.updatedBy],
      references: [member.id],
      relationName: "conversationUpdatedBy",
    }),
    workspace: one(workspaces, {
      fields: [conversations.workspaceId],
      references: [workspaces.id],
    }),
    user: one(user, {
      fields: [conversations.createdBy],
      references: [user.id],
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
