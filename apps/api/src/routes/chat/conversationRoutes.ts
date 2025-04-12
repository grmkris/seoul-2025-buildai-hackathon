import { conversations, messages } from "@/db/schema/chat/chat.db";
import {
  InsertConversationSchema,
  SelectConversationSchema,
  SelectMessageSchema,
} from "@/db/schema/chat/chat.zod";
import { WORKSPACE_PATH } from "@/utils";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { ConversationId, OrganizationId, WorkspaceId } from "typeid";
import { z } from "zod";
import {
  commonHeaderSchema,
  createCommonErrorSchema,
  createJsonSchema,
  createOpenAPIRoute,
  validateAuth,
} from "../helpers";
import { checkOrganizationAccess } from "../helpers";
import { checkWorkspaceAccess } from "../helpers";
// Define order constants and schemas
export const ORDER_DIRECTIONS = ["asc", "desc"] as const;
export const ORDER_BY_FIELDS = ["title", "createdAt", "updatedAt"] as const;
export const OrderDirection = z.enum(ORDER_DIRECTIONS);
export const OrderByField = z.enum(ORDER_BY_FIELDS);
export type OrderDirection = z.infer<typeof OrderDirection>;
export type OrderByField = z.infer<typeof OrderByField>;

// List conversations schema
export const ListConversationsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  orderBy: OrderByField.optional(),
  orderDirection: OrderDirection.optional(),
});
export type ListConversationsSchema = z.infer<typeof ListConversationsSchema>;

export const ListConversationsRouteSchema = z.object({
  data: z.array(
    SelectConversationSchema.extend({
      lastMessage: SelectMessageSchema.optional(),
    }),
  ),
  pagination: z.object({
    currentPage: z.coerce.number(),
    totalPages: z.coerce.number(),
    pageSize: z.coerce.number(),
    totalCount: z.coerce.number(),
  }),
});
export type ListConversationsRouteSchema = z.infer<
  typeof ListConversationsRouteSchema
>;

// Schema for creating new conversation
export const CreateConversationSchema = InsertConversationSchema;
export type CreateConversationSchema = z.infer<typeof CreateConversationSchema>;

// Schema for updating conversation
export const UpdateConversationSchema = InsertConversationSchema.partial();
export type UpdateConversationSchema = z.infer<typeof UpdateConversationSchema>;

// Schema for getting conversation - Simplified: Removed audit history
export const GetConversationSchema = SelectConversationSchema;
export type GetConversationSchema = z.infer<typeof GetConversationSchema>;

/**
 * Route: Create a new conversation
 */
const createConversationRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "post",
    path: "",
    tags: ["Chat"],
    summary: "Create a conversation",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
      }),
      body: createJsonSchema(CreateConversationSchema),
      headers: commonHeaderSchema,
    },
    responses: {
      201: {
        description: "Conversation created successfully",
        content: {
          "application/json": {
            schema: SelectConversationSchema,
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    try {
      const data = c.req.valid("json");
      const db = c.get("db");
      const session = validateAuth(c);
      const workspaceId = c.req.valid("param").workspaceId;
      const requestId = c.get("requestId");
      const logger = c.get("logger");

      if (!session.memberId) {
        return c.json(
          { message: "Unauthorized", requestId: c.get("requestId") },
          401,
        );
      }

      // Create the conversation
      const newConversation = await db
        .insert(conversations)
        .values({
          ...data,
          createdBy: session.memberId,
          updatedBy: session.memberId,
          workspaceId: workspaceId,
        })
        .returning();

      if (!newConversation[0]?.id) {
        return c.json({ message: "Conversation not created", requestId }, 500);
      }

      const conversationId = newConversation[0].id;

      logger.info({
        msg: "Conversation created",
        conversationId,
        workspaceId,
        createdBy: session.memberId,
      });

      return c.json(newConversation[0], 201);
    } catch (error) {
      c.get("logger").error({
        msg: "Error creating conversation",
        error,
      });
      return c.json(
        {
          message: "Internal server error",
          requestId: c.get("requestId"),
        },
        500,
      );
    }
  },
);

/**
 * Route: Get a conversation - Simplified (removed audit history)
 */
const getConversationRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "get",
    path: "/:conversationId",
    tags: ["Chat"],
    summary: "Get conversation details",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
        conversationId: ConversationId,
      }),
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "Conversation retrieved successfully",
        content: {
          "application/json": {
            schema: GetConversationSchema, // Use simplified schema
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    try {
      const { conversationId } = c.req.valid("param");
      const db = c.get("db");
      const workspaceId = c.req.valid("param").workspaceId;
      const requestId = c.get("requestId");

      // Get conversation - Removed audit history query
      const conversation = await db.query.conversations.findFirst({
        where: and(
          eq(conversations.id, conversationId),
          eq(conversations.workspaceId, workspaceId),
        ),
      });

      if (!conversation) {
        return c.json({ message: "Conversation not found", requestId }, 404);
      }

      // Return the plain conversation object
      return c.json(conversation, 200);
    } catch (error) {
      c.get("logger").error({
        msg: "Error getting conversation",
        error,
      });
      return c.json(
        {
          message: "Internal server error",
          requestId: c.get("requestId"),
        },
        500,
      );
    }
  },
);

/**
 * Route: List all conversations the user is a participant in
 */
const listConversationsRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "get",
    path: "",
    tags: ["Chat"],
    summary: "List conversations",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
      }),
      query: ListConversationsSchema,
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "List of conversations retrieved successfully",
        content: {
          "application/json": {
            schema: ListConversationsRouteSchema,
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    const logger = c.get("logger");
    const session = validateAuth(c);
    logger.debug({
      msg: "Listing conversations",
      requestId: c.get("requestId"),
      member: session.memberId,
    });

    try {
      const db = c.get("db");
      const {
        page: pageString = "1",
        limit: limitString = "10",
        search,
        orderBy = "updatedAt",
        orderDirection = "desc",
      } = c.req.valid("query");
      const workspaceId = c.req.valid("param").workspaceId;

      const page = Number(pageString);
      const limit = Number(limitString);
      const offset = (page - 1) * limit;

      // Create filter for conversations
      const filters = [eq(conversations.workspaceId, workspaceId)];

      // Add search if provided
      if (search) {
        filters.push(ilike(conversations.title, `%${search}%`));
      }

      // Build order by clause
      const orderByClause = {
        title: conversations.title,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
      }[orderBy];

      // Get total count for pagination
      const totalCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(conversations)
        .where(and(...filters));

      const totalCount = totalCountResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      // Get the conversations
      const conversationsList = await db.query.conversations.findMany({
        where: and(...filters),
        orderBy: [
          orderDirection === "asc" ? asc(orderByClause) : desc(orderByClause),
        ],
        limit,
        offset,
      });

      // For each conversation, get the latest message
      const conversationsWithLastMessage = await Promise.all(
        conversationsList.map(async (conversation) => {
          const lastMessage = await db.query.messages.findFirst({
            where: eq(messages.conversationId, conversation.id),
            orderBy: [desc(messages.createdAt)],
          });

          return {
            ...conversation,
            lastMessage: lastMessage || undefined,
          };
        }),
      );

      return c.json(
        {
          data: conversationsWithLastMessage,
          pagination: {
            currentPage: page,
            totalPages,
            pageSize: limit,
            totalCount,
          },
        },
        200,
      );
    } catch (error) {
      logger.error({
        msg: "Error listing conversations",
        error,
      });
      return c.json(
        {
          message: "Internal server error",
          requestId: c.get("requestId"),
        },
        500,
      );
    }
  },
);

/**
 * Route: Update a conversation
 */
const updateConversationRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "patch",
    path: "",
    tags: ["Chat"],
    summary: "Update conversation",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
        conversationId: ConversationId,
      }),
      body: createJsonSchema(UpdateConversationSchema),
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "Conversation updated successfully",
        content: {
          "application/json": {
            schema: SelectConversationSchema,
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    try {
      const { conversationId } = c.req.valid("param");
      const data = c.req.valid("json");
      const db = c.get("db");
      const session = validateAuth(c);
      const workspaceId = c.req.valid("param").workspaceId;

      // Check if the conversation exists
      const existingConversation = await db.query.conversations.findFirst({
        where: and(
          eq(conversations.id, conversationId),
          eq(conversations.workspaceId, workspaceId),
        ),
      });

      if (!existingConversation) {
        return c.json(
          {
            message: "Conversation not found",
            requestId: c.get("requestId"),
          },
          404,
        );
      }

      if (!session.memberId) {
        return c.json(
          { message: "Unauthorized", requestId: c.get("requestId") },
          401,
        );
      }

      // Update the conversation
      const updatedConversation = await db
        .update(conversations)
        .set({ ...data, updatedBy: session.memberId })
        .where(
          and(
            eq(conversations.id, conversationId),
            eq(conversations.workspaceId, workspaceId),
          ),
        )
        .returning();

      if (!updatedConversation.length) {
        return c.json(
          {
            message: "Conversation not found",
            requestId: c.get("requestId"),
          },
          404,
        );
      }

      return c.json(updatedConversation[0], 200);
    } catch (error) {
      c.get("logger").error({
        msg: "Error updating conversation",
        error,
      });
      return c.json(
        {
          message: "Internal server error",
          requestId: c.get("requestId"),
        },
        500,
      );
    }
  },
);

/**
 * Route: Delete (archive) a conversation
 */
const deleteConversationRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "delete",
    path: "",
    tags: ["Chat"],
    summary: "Delete conversation",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
        conversationId: ConversationId,
      }),
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "Conversation deleted successfully",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    try {
      const { conversationId } = c.req.valid("param");
      const db = c.get("db");
      const workspaceId = c.req.valid("param").workspaceId;
      const requestId = c.get("requestId");

      // Check if the conversation exists
      const existingConversation = await db.query.conversations.findFirst({
        where: and(
          eq(conversations.id, conversationId),
          eq(conversations.workspaceId, workspaceId),
        ),
      });

      if (!existingConversation) {
        return c.json(
          {
            message: "Conversation not found",
            requestId,
          },
          404,
        );
      }

      // Delete the conversation
      const deletedConversation = await db
        .delete(conversations)
        .where(
          and(
            eq(conversations.id, conversationId),
            eq(conversations.workspaceId, workspaceId),
          ),
        )
        .returning();

      if (!deletedConversation.length) {
        return c.json(
          { message: "Failed to delete conversation", requestId },
          500,
        );
      }

      return c.json({ message: "Conversation deleted successfully" }, 200);
    } catch (error) {
      c.get("logger").error({
        msg: "Error deleting conversation",
        error,
      });
      return c.json(
        {
          message: "Internal server error",
          requestId: c.get("requestId"),
        },
        500,
      );
    }
  },
);

// Create and export the conversation routes
const conversationRoutes = new OpenAPIHono()
  .use(`${WORKSPACE_PATH}/chat/conversations/*`, checkOrganizationAccess) // Use wildcard for middleware
  .use(`${WORKSPACE_PATH}/chat/conversations/*`, checkWorkspaceAccess)
  .basePath(`${WORKSPACE_PATH}/chat/conversations`)
  .route("/", createConversationRoute)
  .route("/", listConversationsRoute)
  .route("/:conversationId", getConversationRoute)
  .route("/:conversationId", updateConversationRoute)
  .route("/:conversationId", deleteConversationRoute);

export { conversationRoutes };
