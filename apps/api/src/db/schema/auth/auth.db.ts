import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import {
  type AccountId,
  type ApiKeyId,
  type OrganizationId,
  type PasskeyId,
  type SessionId,
  type UserId,
  type VerificationId,
  typeIdGenerator,
} from "typeid";
import { organization } from "../orgs/orgs.db";
import { baseEntityFields, createTimestampField, typeId } from "../utils.db";

export const user = pgTable("user", {
  id: typeId("user", "id")
    .primaryKey()
    .$defaultFn(() => typeIdGenerator("user"))
    .$type<UserId>(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  ...baseEntityFields,
  isAnonymous: boolean("is_anonymous"),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: createTimestampField("ban_expires"),
});

export const session = pgTable("session", {
  id: typeId("session", "id")
    .primaryKey()
    .$defaultFn(() => typeIdGenerator("session"))
    .$type<SessionId>(),
  expiresAt: createTimestampField("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ...baseEntityFields,
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: typeId("user", "user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .$type<UserId>(),
  impersonatedBy: typeId("user", "impersonated_by")
    .references(() => user.id, { onDelete: "set null" })
    .$type<UserId>(),
  activeOrganizationId: typeId("organization", "active_organization_id")
    .references(() => organization.id, { onDelete: "set null" })
    .$type<OrganizationId>(),
});

export const account = pgTable("account", {
  id: typeId("account", "id")
    .primaryKey()
    .$defaultFn(() => typeIdGenerator("account"))
    .$type<AccountId>(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: typeId("user", "user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .$type<UserId>(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: createTimestampField("access_token_expires_at"),
  refreshTokenExpiresAt: createTimestampField("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  ...baseEntityFields,
});

export const verification = pgTable("verification", {
  id: typeId("verification", "id")
    .primaryKey()
    .$defaultFn(() => typeIdGenerator("verification"))
    .$type<VerificationId>(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: createTimestampField("expires_at").notNull(),
  createdAt: createTimestampField("created_at"),
  updatedAt: createTimestampField("updated_at"),
});

export const passkey = pgTable("passkey", {
  id: typeId("passkey", "id")
    .primaryKey()
    .$defaultFn(() => typeIdGenerator("passkey"))
    .$type<PasskeyId>(),
  name: text("name"),
  publicKey: text("public_key").notNull(),
  userId: typeId("user", "user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .$type<UserId>(),
  credentialID: text("credential_i_d").notNull(),
  counter: integer("counter").notNull(),
  deviceType: text("device_type").notNull(),
  backedUp: boolean("backed_up").notNull(),
  transports: text("transports"),
  createdAt: createTimestampField("created_at"),
});

export const apikey = pgTable("apikey", {
  id: typeId("apikey", "id")
    .primaryKey()
    .$defaultFn(() => typeIdGenerator("apikey"))
    .$type<ApiKeyId>(),
  name: text("name"),
  start: text("start"),
  prefix: text("prefix"),
  key: text("key").notNull(),
  userId: typeId("user", "user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .$type<UserId>(),
  refillInterval: integer("refill_interval"),
  refillAmount: integer("refill_amount"),
  lastRefillAt: createTimestampField("last_refill_at"),
  enabled: boolean("enabled"),
  rateLimitEnabled: boolean("rate_limit_enabled"),
  rateLimitTimeWindow: integer("rate_limit_time_window"),
  rateLimitMax: integer("rate_limit_max"),
  requestCount: integer("request_count"),
  remaining: integer("remaining"),
  lastRequest: createTimestampField("last_request"),
  expiresAt: createTimestampField("expires_at"),
  ...baseEntityFields,
  permissions: text("permissions"),
  metadata: text("metadata"),
});
