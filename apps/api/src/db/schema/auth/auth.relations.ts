import { relations } from "drizzle-orm";
import { member, organization } from "../orgs/orgs.db";
import { account, apikey, passkey, session, user } from "./auth.db";
import { conversations, messages } from "../chat/chat.db";
import { customersTable } from "../customers/customers.db";

// --- Relations for the User table ---
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session, { relationName: "userSessions" }), // Explicit relation name
  accounts: many(account, { relationName: "userAccounts" }), // Explicit relation name
  passkeys: many(passkey, { relationName: "userPasskeys" }), // Explicit relation name
  apiKeys: many(apikey, { relationName: "userApiKeys" }), // Explicit relation name
  members: many(member, { relationName: "userMemberships" }), // Link to organization memberships
  conversations: many(conversations),
  messages: many(messages),
  customers: many(customersTable),
  // Potential direct links (if user owns these directly, adjust based on actual schema)
  // customers: many(customersTable), // If user maps directly to customer
}));

// --- Relations for the Session table ---
export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
    relationName: "userSessions", // Matches userRelations
  }),
  impersonator: one(user, {
    fields: [session.impersonatedBy],
    references: [user.id],
    relationName: "impersonatedSessions", // Explicit relation name
  }),
  activeOrganization: one(organization, {
    fields: [session.activeOrganizationId],
    references: [organization.id],
    // relationName: "activeSessions" // Optional: Add if needed on organization table
  }),
}));

// --- Relations for the Account table ---
export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
    relationName: "userAccounts", // Matches userRelations
  }),
}));

// --- Relations for the Passkey table ---
export const passkeyRelations = relations(passkey, ({ one }) => ({
  user: one(user, {
    fields: [passkey.userId],
    references: [user.id],
    relationName: "userPasskeys", // Matches userRelations
  }),
}));

// --- Relations for the ApiKey table ---
export const apikeyRelations = relations(apikey, ({ one }) => ({
  user: one(user, {
    fields: [apikey.userId],
    references: [user.id],
    relationName: "userApiKeys", // Matches userRelations
  }),
}));
