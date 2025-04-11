import { index, pgTable, text, varchar } from "drizzle-orm/pg-core";
import {
  type InvitationId,
  type MemberId,
  type OrganizationId,
  type UserId,
  type WorkspaceId,
  typeIdGenerator,
} from "typeid";
import { user } from "../auth/auth.db"; // Assuming user table remains in auth
import { baseEntityFields, createTimestampField, typeId } from "../utils.db";

/**
 * Organization table is handled by better-auth library
 */
export const organization = pgTable("organization", {
  id: typeId("organization", "id")
    .primaryKey()
    .$defaultFn(() => typeIdGenerator("organization"))
    .$type<OrganizationId>(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: createTimestampField("created_at").notNull(),
  metadata: text("metadata"),
});

/**
 * Member table is handled by better-auth library
 */
export const member = pgTable("member", {
  id: typeId("member", "id")
    .primaryKey()
    .$defaultFn(() => typeIdGenerator("member"))
    .$type<MemberId>(),
  organizationId: typeId("organization", "organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" })
    .$type<OrganizationId>(),
  userId: typeId("user", "user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .$type<UserId>(),
  role: text("role").notNull(),
  teamId: text("team_id"), // Consider if this should reference a team table
  createdAt: createTimestampField("created_at").notNull(),
});

/**
 * Invitation table is handled by better-auth library
 */
export const invitation = pgTable("invitation", {
  id: typeId("invitation", "id")
    .primaryKey()
    .$defaultFn(() => typeIdGenerator("invitation"))
    .$type<InvitationId>(),
  organizationId: typeId("organization", "organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" })
    .$type<OrganizationId>(),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: createTimestampField("expires_at").notNull(),
  inviterId: typeId("user", "inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }) // Assuming inviter is a user
    .$type<UserId>(),
  teamId: text("team_id"), // Consider if this should reference a team table
});

// Define the workspaces table
export const workspaces = pgTable(
  "workspaces",
  {
    id: typeId("workspace", "id")
      .primaryKey()
      .$defaultFn(() => typeIdGenerator("workspace"))
      .$type<WorkspaceId>(),
    name: varchar("name", { length: 255 }).notNull(),
    organizationId: typeId("organization", "organization_id")
      .notNull()
      .$type<OrganizationId>()
      .references(() => organization.id),
    ...baseEntityFields,
  },
  (t) => [index().on(t.organizationId)],
);
