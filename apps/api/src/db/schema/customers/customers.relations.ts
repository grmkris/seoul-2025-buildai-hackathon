import { relations } from "drizzle-orm";
import { member } from "../orgs/orgs.db";
import { workspaces } from "../orgs/orgs.db";
import { customersTable } from "./customers.db";

export const customersRelations = relations(customersTable, ({ one }) => ({
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
}));
