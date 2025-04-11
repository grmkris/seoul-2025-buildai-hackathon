import { relations } from "drizzle-orm";
import { user } from "../auth/auth.db"; // Import user and session if needed
import { conversations, messages } from "../chat/chat.db";
import { customersTable } from "../customers/customers.db";
import { invitation, member, organization, workspaces } from "./orgs.db";

// --- Relations for the Organization table ---
export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
  workspaces: many(workspaces),
  // sessions: many(session), // Relation via session.activeOrganizationId if needed
}));

// --- Relations for the Member table ---
export const memberRelations = relations(member, ({ one, many }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
    relationName: "userMemberships", // Matches relation name in userRelations (if you add it back there)
  }),
  createdConversations: many(conversations, {
    relationName: "conversationCreatedBy",
  }),
  updatedConversations: many(conversations, {
    relationName: "conversationUpdatedBy",
  }),
  createdMessages: many(messages, { relationName: "messageCreatedBy" }),
  updatedMessages: many(messages, { relationName: "messageUpdatedBy" }),
}));

// --- Relations for the Invitation table ---
export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  inviter: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
    relationName: "inviter", // Matches relation name in userRelations (if you add it back there)
  }),
}));

// --- Relations for the Workspace table ---
export const workspaceRelations = relations(workspaces, ({ one, many }) => ({
  organization: one(organization, {
    fields: [workspaces.organizationId],
    references: [organization.id],
  }),
  // Add relations for entities contained within a workspace
  customers: many(customersTable),
  conversations: many(conversations),
}));
