import { conversations, messages } from "@/db/schema/chat/chat.db";
import { customersTable } from "@/db/schema/customers/customers.db";
import { workspaces } from "@/db/schema/orgs/orgs.db";
import { SelectWorkspaceSchema } from "@/db/schema/orgs/orgs.zod";
import type { ContextVariables } from "@/types";
import { ORGANIZATION_PATH } from "@/utils";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import { OrganizationId, RequestId, WorkspaceId } from "typeid";
import { z } from "zod";
import {
  commonHeaderSchema,
  createCommonErrorSchema,
  createJsonSchema,
  createOpenAPIRoute,
  validateAuth,
} from "../helpers";

const createWorkspaceRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "post",
    path: "",
    tags: ["Workspaces"],
    summary: "Create Workspace",
    request: {
      params: z.object({ organizationId: OrganizationId }),
      body: createJsonSchema(
        z.object({
          name: z.string().min(1).max(255),
        }),
      ),
      headers: commonHeaderSchema,
    },
    responses: {
      201: {
        description: "Workspace created successfully",
        content: {
          "application/json": {
            schema: z.object({
              workspaceId: WorkspaceId,
            }),
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    const { organizationId } = c.req.valid("param");
    const { name } = c.req.valid("json");
    const logger = c.get("logger");
    const db = c.get("db");
    const session = validateAuth(c);
    const requestId = c.get("requestId");

    logger.debug({
      msg: "Creating workspace",
      organizationId,
      name,
    });

    logger.debug({
      msg: "Active member createWorkspaceRoute",
      session,
    });

    if (
      session.systemRole !== "admin" &&
      session.organizationRole !== "owner" &&
      session.organizationRole !== "admin"
    ) {
      return c.json(
        { message: "Only admins can create workspaces", requestId },
        403,
      );
    }

    logger.debug("Inserting workspace", {
      name,
      organizationId,
    });

    const newWorkspace = await db
      .insert(workspaces)
      .values({
        name,
        organizationId,
      })
      .returning();

    logger.debug("New workspace", {
      newWorkspace,
    });

    if (!newWorkspace[0]) {
      logger.error("Failed to create workspace", {
        requestId,
      });
      return c.json({ message: "Failed to create workspace", requestId }, 500);
    }

    return c.json({ workspaceId: newWorkspace[0].id }, 201);
  },
);

const updateWorkspaceRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "put",
    path: "",
    tags: ["Workspaces"],
    summary: "Update Workspace",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
      }),
      body: createJsonSchema(
        z.object({
          name: z.string().min(1).max(255),
        }),
      ),
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "Workspace updated successfully",
        content: {
          "application/json": {
            schema: z.object({
              workspaceId: WorkspaceId,
            }),
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    const { organizationId, workspaceId } = c.req.valid("param");
    const { name } = c.req.valid("json");
    const db = c.get("db");
    const session = validateAuth(c);
    const requestId = c.get("requestId");

    if (
      session.systemRole !== "admin" &&
      session.organizationRole !== "owner"
    ) {
      return c.json(
        { message: "Only admins can update workspaces", requestId },
        403,
      );
    }

    const updatedWorkspace = await db
      .update(workspaces)
      .set({ name, updatedAt: new Date() })
      .where(
        and(
          eq(workspaces.id, workspaceId),
          eq(workspaces.organizationId, organizationId),
        ),
      )
      .returning();

    if (!updatedWorkspace[0]) {
      return c.json({ message: "Workspace not found", requestId }, 404);
    }

    return c.json({ workspaceId: updatedWorkspace[0].id }, 200);
  },
);

const deleteWorkspaceRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "delete",
    path: "/:workspaceId",
    tags: ["Workspaces"],
    summary: "Delete Workspace",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
      }),
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "Workspace deleted successfully",
        content: {
          "application/json": {
            schema: z.object({
              message: z.literal("Workspace deleted successfully"),
              requestId: RequestId,
            }),
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    const { organizationId, workspaceId } = c.req.valid("param");
    const db = c.get("db");
    const session = validateAuth(c);
    const requestId = c.get("requestId");
    const logger = c.get("logger");

    if (
      session.systemRole !== "admin" &&
      session.organizationRole !== "owner"
    ) {
      return c.json(
        { message: "Only admins can delete workspaces", requestId },
        403,
      );
    }

    // Check if workspace exists and belongs to the organization
    const workspace = await db.query.workspaces.findFirst({
      where: and(
        eq(workspaces.id, workspaceId),
        eq(workspaces.organizationId, organizationId),
      ),
    });

    if (!workspace) {
      return c.json({ message: "Workspace not found", requestId }, 404);
    }

    try {
      // Use a transaction to ensure all related records are deleted
      const result = await db.transaction(async (tx) => {
        // Delete related records based on the current schema

        // 1. Delete messages (depend on conversations)
        await tx.delete(messages).where(eq(messages.workspaceId, workspaceId));

        // 2. Delete conversations
        await tx
          .delete(conversations)
          .where(eq(conversations.workspaceId, workspaceId));

        // 3. Delete customers
        await tx
          .delete(customersTable)
          .where(eq(customersTable.workspaceId, workspaceId));

        // 4. Finally, delete the workspace
        const deletedWorkspace = await tx
          .delete(workspaces)
          .where(
            and(
              eq(workspaces.id, workspaceId),
              eq(workspaces.organizationId, organizationId),
            ),
          )
          .returning();

        return deletedWorkspace;
      });

      if (!result[0]) {
        // Log the error if deletion failed within transaction
        logger.error("Failed to delete workspace within transaction", {
          requestId,
          workspaceId,
        });
        return c.json(
          { message: "Failed to delete workspace", requestId },
          500,
        );
      }

      return c.json(
        {
          message: "Workspace deleted successfully" as const,
          requestId,
        },
        200,
      );
    } catch (error) {
      logger.error({
        msg: "Error deleting workspace",
        error,
        requestId,
        workspaceId,
      });
      return c.json({ message: "Failed to delete workspace", requestId }, 500);
    }
  },
);

const getAllWorkspacesRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "get",
    path: "",
    tags: ["Workspaces"],
    summary: "Get All Workspaces",
    request: {
      params: z.object({ organizationId: OrganizationId }),
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "List of all workspaces retrieved successfully",
        content: {
          "application/json": {
            schema: z.array(SelectWorkspaceSchema),
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {

    const { organizationId } = c.req.valid("param");
    const db = c.get("db");
    validateAuth(c);
    const requestId = c.get("requestId");
    const logger = c.get("logger");
    logger.debug({
      msg: "Getting all workspaces",
      organizationId,
    });
    try {
      const allWorkspaces = await db.query.workspaces.findMany({
        where: eq(workspaces.organizationId, organizationId),
      });

      return c.json(allWorkspaces, 200);
    } catch (error) {
      logger.error({
        msg: "Error retrieving workspaces",
        error,
        requestId,
        organizationId,
      });
      return c.json(
        { message: "Failed to retrieve workspaces", requestId },
        500,
      );
    }
  },
);

const getWorkspaceRoute = new OpenAPIHono<{
  Variables: ContextVariables;
}>().openapi(
  createRoute({
    method: "get",
    path: "/:workspaceId",
    tags: ["Workspaces"],
    summary: "Get Single Workspace",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
      }),
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "Workspace retrieved successfully",
        content: {
          "application/json": {
            schema: SelectWorkspaceSchema,
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    const { organizationId, workspaceId } = c.req.valid("param");
    const db = c.get("db");
    validateAuth(c);
    const requestId = c.get("requestId");
    const logger = c.get("logger");

    try {
      const workspace = await db.query.workspaces.findFirst({
        where: and(
          eq(workspaces.id, workspaceId),
          eq(workspaces.organizationId, organizationId),
        ),
      });

      if (!workspace) {
        return c.json({ message: "Workspace not found", requestId }, 404);
      }

      return c.json(workspace, 200);
    } catch (error) {
      logger.error({
        msg: "Error retrieving single workspace",
        error,
        requestId,
        organizationId,
        workspaceId,
      });
      return c.json(
        { message: "Failed to retrieve workspace", requestId },
        500,
      );
    }
  },
);

export const workspaceRouter = new OpenAPIHono<{
  Variables: ContextVariables;
}>()
  .route(`${ORGANIZATION_PATH}/workspaces/`, createWorkspaceRoute)
  .route(`${ORGANIZATION_PATH}/workspaces/:workspaceId`, updateWorkspaceRoute)
  .route(`${ORGANIZATION_PATH}/workspaces/:workspaceId`, deleteWorkspaceRoute)
  .route(`${ORGANIZATION_PATH}/workspaces/`, getAllWorkspacesRoute)
  .route(`${ORGANIZATION_PATH}/workspaces/:workspaceId`, getWorkspaceRoute);

export type WorkspaceRouter = typeof workspaceRouter;
