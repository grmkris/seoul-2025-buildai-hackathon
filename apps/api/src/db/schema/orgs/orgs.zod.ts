import { createSelectSchema } from "drizzle-zod";
import {
  InvitationId as InvitationIdSchema,
  MemberId as MemberIdSchema,
  OrganizationId as OrganizationIdSchema,
  UserId as UserIdSchema,
  WorkspaceId as WorkspaceIdSchema,
} from "typeid";
import { z } from "zod";
import { invitation, member, organization, workspaces } from "./orgs.db";

// Organization Schemas
export const SelectOrganizationSchema = createSelectSchema(organization, {
  id: OrganizationIdSchema,
  createdAt: z.coerce.date(),
});
export const InsertOrganizationSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  logo: z.string().optional(),
  metadata: z.string().optional(),
});
export type SelectOrganizationSchema = z.infer<typeof SelectOrganizationSchema>;
export type InsertOrganizationSchema = z.infer<typeof InsertOrganizationSchema>;

// Member Schemas
export const SelectMemberSchema = createSelectSchema(member, {
  id: MemberIdSchema,
  organizationId: OrganizationIdSchema,
  userId: UserIdSchema,
  createdAt: z.coerce.date(),
});
export const InsertMemberSchema = z.object({
  organizationId: OrganizationIdSchema,
  userId: UserIdSchema,
  role: z.string().min(1),
  teamId: z.string().optional(),
});
export type SelectMemberSchema = z.infer<typeof SelectMemberSchema>;
export type InsertMemberSchema = z.infer<typeof InsertMemberSchema>;

// Invitation Schemas
export const SelectInvitationSchema = createSelectSchema(invitation, {
  id: InvitationIdSchema,
  organizationId: OrganizationIdSchema,
  expiresAt: z.coerce.date(),
  inviterId: UserIdSchema,
});
export const InsertInvitationSchema = z.object({
  organizationId: OrganizationIdSchema,
  email: z.string().email(),
  role: z.string().optional(),
  status: z.string().min(1),
  expiresAt: z.coerce.date(),
  inviterId: UserIdSchema,
  teamId: z.string().optional(),
});
export type SelectInvitationSchema = z.infer<typeof SelectInvitationSchema>;
export type InsertInvitationSchema = z.infer<typeof InsertInvitationSchema>;

// Workspace Schemas
export const SelectWorkspaceSchema = createSelectSchema(workspaces, {
  id: WorkspaceIdSchema,
  organizationId: OrganizationIdSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export const InsertWorkspaceSchema = z.object({
  name: z.string().min(1).max(255),
});
export type SelectWorkspaceSchema = z.infer<typeof SelectWorkspaceSchema>;
export type InsertWorkspaceSchema = z.infer<typeof InsertWorkspaceSchema>;
