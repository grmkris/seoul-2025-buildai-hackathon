import { HTTPException } from "hono/http-exception";

import type { Context } from "hono";
import type { ContextVariables } from "./types";

export const getRole = (c: Context<{ Variables: ContextVariables }>) => {
  const session = c.get("session");
  const role = session?.organizationRole;
  if (!role) throw new HTTPException(401, { message: "Unauthorized" });
  return role;
};

// Define common route paths
export const ORGANIZATION_PATH =
  "/admin/organizations/:organizationId" as const;
export const WORKSPACE_PATH =
  `${ORGANIZATION_PATH}/workspaces/:workspaceId` as const;
export const PUBLIC_PATH = "/public" as const;