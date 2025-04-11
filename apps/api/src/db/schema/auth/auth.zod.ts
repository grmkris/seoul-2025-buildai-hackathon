import { createSelectSchema } from "drizzle-zod";
import {
  AccountId as AccountIdSchema,
  ApiKeyId as ApiKeyIdSchema,
  PasskeyId as PasskeyIdSchema,
  SessionId as SessionIdSchema,
  UserId as UserIdSchema,
  VerificationId as VerificationIdSchema,
} from "typeid";
import { OrganizationId as OrganizationIdSchema } from "typeid";
import { z } from "zod";
import {
  account,
  apikey,
  passkey,
  session,
  user,
  verification,
} from "./auth.db";

// User Schemas
export const SelectUserSchema = createSelectSchema(user, {
  id: UserIdSchema,
  emailVerified: z.boolean(),
  isAnonymous: z.boolean().nullable(),
  banned: z.boolean().nullable(),
  banExpires: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export const InsertUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  isAnonymous: z.boolean().optional(),
  username: z.string().optional(),
  displayUsername: z.string().optional(),
  role: z.string().optional(),
  banned: z.boolean().optional(),
  banReason: z.string().optional(),
  banExpires: z.coerce.date().optional(),
});
export type SelectUserSchema = z.infer<typeof SelectUserSchema>;
export type InsertUserSchema = z.infer<typeof InsertUserSchema>;

// Session Schemas
export const SelectSessionSchema = createSelectSchema(session, {
  id: SessionIdSchema,
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: UserIdSchema,
  impersonatedBy: UserIdSchema.nullable(),
  activeOrganizationId: OrganizationIdSchema.nullable(),
});
export const InsertSessionSchema = z.object({
  expiresAt: z.coerce.date(),
  token: z.string().min(1),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  userId: UserIdSchema,
  impersonatedBy: UserIdSchema.optional().nullable(),
  activeOrganizationId: OrganizationIdSchema.optional().nullable(),
});
export type SelectSessionSchema = z.infer<typeof SelectSessionSchema>;
export type InsertSessionSchema = z.infer<typeof InsertSessionSchema>;

// Account Schemas
export const SelectAccountSchema = createSelectSchema(account, {
  id: AccountIdSchema,
  userId: UserIdSchema,
  accessTokenExpiresAt: z.coerce.date().nullable(),
  refreshTokenExpiresAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export const InsertAccountSchema = z.object({
  accountId: z.string().min(1),
  providerId: z.string().min(1),
  userId: UserIdSchema,
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  idToken: z.string().optional(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional(),
  password: z.string().optional(),
});
export type SelectAccountSchema = z.infer<typeof SelectAccountSchema>;
export type InsertAccountSchema = z.infer<typeof InsertAccountSchema>;

// Verification Schemas
export const SelectVerificationSchema = createSelectSchema(verification, {
  id: VerificationIdSchema,
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable(),
});
export const InsertVerificationSchema = z.object({
  identifier: z.string().min(1),
  value: z.string().min(1),
  expiresAt: z.coerce.date(),
});
export type SelectVerificationSchema = z.infer<typeof SelectVerificationSchema>;
export type InsertVerificationSchema = z.infer<typeof InsertVerificationSchema>;

// Passkey Schemas
export const SelectPasskeySchema = createSelectSchema(passkey, {
  id: PasskeyIdSchema,
  userId: UserIdSchema,
  createdAt: z.coerce.date().nullable(),
  backedUp: z.boolean(),
});
export const InsertPasskeySchema = z.object({
  name: z.string().optional(),
  publicKey: z.string().min(1),
  userId: UserIdSchema,
  credentialID: z.string().min(1),
  counter: z.number().int(),
  deviceType: z.string().min(1),
  backedUp: z.boolean(),
  transports: z.string().optional(),
});
export type SelectPasskeySchema = z.infer<typeof SelectPasskeySchema>;
export type InsertPasskeySchema = z.infer<typeof InsertPasskeySchema>;

// ApiKey Schemas
export const SelectApiKeySchema = createSelectSchema(apikey, {
  id: ApiKeyIdSchema,
  userId: UserIdSchema,
  lastRefillAt: z.coerce.date().nullable(),
  enabled: z.boolean().nullable(),
  rateLimitEnabled: z.boolean().nullable(),
  lastRequest: z.coerce.date().nullable(),
  expiresAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export const InsertApiKeySchema = z.object({
  name: z.string().optional(),
  start: z.string().optional(),
  prefix: z.string().optional(),
  key: z.string().min(1),
  userId: UserIdSchema,
  refillInterval: z.number().int().optional(),
  refillAmount: z.number().int().optional(),
  lastRefillAt: z.coerce.date().optional().nullable(),
  enabled: z.boolean().optional().nullable(),
  rateLimitEnabled: z.boolean().optional().nullable(),
  rateLimitTimeWindow: z.number().int().optional(),
  rateLimitMax: z.number().int().optional(),
  requestCount: z.number().int().optional(),
  remaining: z.number().int().optional(),
  lastRequest: z.coerce.date().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  permissions: z.string().optional(),
  metadata: z.string().optional(),
});
export type SelectApiKeySchema = z.infer<typeof SelectApiKeySchema>;
export type InsertApiKeySchema = z.infer<typeof InsertApiKeySchema>;
