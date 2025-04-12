import { pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { typeIdGenerator } from "typeid";
import { member } from "../orgs/orgs.db";
import { workspaces } from "../orgs/orgs.db";
import { createFullEntityFieldsWithMember, typeId } from "../utils.db";

export const customersTable = pgTable(
  "customers",
  {
    id: typeId("customer", "id")
      .primaryKey()
      .$defaultFn(() => typeIdGenerator("customer")),
    email: varchar("email", { length: 255 }),
    firstName: varchar("firstName", { length: 50 }),
    lastName: varchar("lastName", { length: 50 }),
    phoneNumber: varchar("phoneNumber", { length: 20 }),
    ...createFullEntityFieldsWithMember(member, workspaces),
  },
  (table) => [
    uniqueIndex("customer_email_idx").on(table.email, table.workspaceId),
  ],
);
