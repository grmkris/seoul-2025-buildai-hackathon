import { relations } from "drizzle-orm";
import { member } from "../orgs/orgs.db";
import { workspaces } from "../orgs/orgs.db";
import { customersTable } from "./customers.db";
import { conversations, messages } from "../chat/chat.db";
import { paymentIntents } from "../payments/payments.db";
export const customersRelations = relations(
  customersTable,
  ({ one, many }) => ({
    createdByMember: one(member, {
      fields: [customersTable.createdBy],
      references: [member.id],
      relationName: "customerCreatedBy",
    }),
    updatedByMember: one(member, {
      fields: [customersTable.updatedBy],
      references: [member.id],
      relationName: "customerUpdatedBy",
    }),
    workspace: one(workspaces, {
      fields: [customersTable.workspaceId],
      references: [workspaces.id],
    }),
    conversations: many(conversations),
    messages: many(messages),
    paymentIntents: many(paymentIntents),
  }),
);
