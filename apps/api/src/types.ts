import type { db } from "@/db/db";
import type { Logger } from "logger";
import type { MemberId, OrganizationId, RequestId, UserId } from "typeid";
import { z } from "zod";

export const ORGANIZATION_ROLES = ["owner", "admin", "member"] as const;
export const OrganizationRole = z.enum(ORGANIZATION_ROLES);
export type OrganizationRole = z.infer<typeof OrganizationRole>;

export const SYSTEM_ROLES = ["admin", "user"] as const;
export const SystemRole = z.enum(SYSTEM_ROLES);
export type SystemRole = z.infer<typeof SystemRole>;

// coming from import type { RequestIdVariables } from "hono/request-id";
// but with the requestId type from typeid
type RequestIdVariables = {
  requestId: RequestId;
};

type Session = {
  userId: UserId;
  memberId: MemberId | null;
  activeOrganizationId: OrganizationId | null;
  organizationRole: OrganizationRole | null;
  systemRole: SystemRole;
};

export type ContextVariables = {
  db: db;
  logger: Logger;
  session: Session | null;
} & RequestIdVariables;
