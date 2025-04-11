import { workspaces } from "@/db/schema/orgs/orgs.db";
import type { ContextVariables } from "@/types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { OrganizationId, RequestId, WorkspaceId } from "typeid";
import { z } from "zod";

/**
 * TODO: this maybe should be removed and we make auth typed middleware that has these not null
 * Validates the user is authenticated
 * @param c - The context object
 * @returns the user, member and session
 * @throws HTTPException if the user is not authenticated
 */
export const validateAuth = (c: Context<{ Variables: ContextVariables }>) => {
  const session = c.get("session");
  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  return session;
};

export function createJsonSchema<T extends z.ZodType>(schema: T) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    required: true,
  } as const;
}

export const commonHeaderSchema = z.object({
  Authorization: z.string().optional().openapi({
    description: "Authorization header",
    example: "Bearer abc123",
  }),
});

// Helper function to check user's organization access
export const checkOrganizationAccess = createMiddleware<{
  Variables: ContextVariables;
}>(async (c, next) => {
  const organizationId = c.req.param("organizationId") as OrganizationId;
  const session = c.get("session");
  const requestId = c.get("requestId");
  const logger = c.get("logger");
  logger.debug({
    msg: "Checking organization access",
    organizationId,
    requestId,
    path: c.req.path,
  });

  // Check if the organizationId has the correct format
  if (!OrganizationId.safeParse(organizationId).success) {
    return c.json(
      { message: "Organization not found - invalid organizationId", requestId },
      404,
    );
  }

  try {
    if (session?.activeOrganizationId !== organizationId) {
      return c.json(
        {
          message: "Access denied to this organization",
          requestId,
        },
        403,
      );
    }

    await next();
  } catch (error) {
    // If there's an error fetching the organization, it likely doesn't exist
    logger.error({
      msg: "Error fetching organization",
      error,
      requestId,
    });
    return c.json(
      {
        message: "Organization not found - could not fetch organization",
        requestId,
      },
      404,
    );
  }
});

// Helper function to check workspace belongs to organization
export const checkWorkspaceAccess = createMiddleware<{
  Variables: ContextVariables;
}>(async (c, next) => {
  const db = c.get("db");
  const organizationIdRaw = c.req.param("organizationId");
  const workspaceIdRaw = c.req.param("workspaceId");
  const requestId = c.get("requestId");
  const logger = c.get("logger");
  logger.debug({
    msg: "Checking workspace access",
    organizationId: organizationIdRaw,
    workspaceId: workspaceIdRaw,
  });

  const organizationId = OrganizationId.safeParse(organizationIdRaw);
  const workspaceId = WorkspaceId.safeParse(workspaceIdRaw);

  if (!organizationId.success) {
    return c.json({ message: "Invalid organizationId", requestId }, 400);
  }

  if (!workspaceId.success) {
    return c.json({ message: "Invalid workspaceId", requestId }, 400);
  }

  const workspace = await db.query.workspaces.findFirst({
    where: and(
      eq(workspaces.id, workspaceId.data),
      eq(workspaces.organizationId, organizationId.data),
    ),
  });

  if (!workspace) {
    return c.json({ message: "Workspace not found", requestId }, 404);
  }
  await next();
});

export const createCommonErrorSchema = () => {
  return {
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string(), // todo let's simplify this maybe
              requestId: RequestId,
            })
            .openapi("Bad Request"),
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string(),
              requestId: RequestId,
            })
            .openapi("Unauthorized"),
        },
      },
    },
    403: {
      description: "Forbidden",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string(),
              requestId: RequestId,
            })
            .openapi("Forbidden"),
        },
      },
    },
    404: {
      description: "Not Found",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string(),
              requestId: RequestId,
            })
            .openapi("Not Found"),
        },
      },
    },
    500: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z
            .object({
              message: z.string(),
              requestId: RequestId,
            })
            .openapi("Internal Server Error"),
        },
      },
    },
  };
};

export const createOpenAPIRoute = () =>
  new OpenAPIHono<{
    Variables: ContextVariables;
  }>({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            requestId: c.get("requestId"),
            message: result,
          },
          400,
        );
      }
    },
  });

// Helper function to check if user is admin for organization
export const isAdmin = async (c: Context<{ Variables: ContextVariables }>) => {
  const session = c.get("session");
  if (!session) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  if (
    session.organizationRole !== "admin" &&
    session.organizationRole !== "owner"
  ) {
    return false;
  }
  return true;
};

export const getWorkspace = async (props: {
  db: ContextVariables["db"];
  workspaceId: WorkspaceId;
  organizationId: OrganizationId;
}) => {
  const { db, workspaceId, organizationId } = props;
  const workspace = await db.query.workspaces.findFirst({
    where: and(
      eq(workspaces.id, workspaceId),
      eq(workspaces.organizationId, organizationId),
    ),
  });

  if (!workspace) {
    throw new HTTPException(404, { message: "Workspace not found" });
  }

  return workspace;
};
