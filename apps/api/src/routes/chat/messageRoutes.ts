import { messages } from "@/db/schema/chat/chat.db";
import { SelectMessageSchema } from "@/db/schema/chat/chat.zod";
import { WORKSPACE_PATH } from "@/utils";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { and, asc, eq } from "drizzle-orm";
import { ConversationId, OrganizationId, WorkspaceId } from "typeid";
import { z } from "zod";
import {
  commonHeaderSchema,
  createCommonErrorSchema,
  createOpenAPIRoute,
} from "../helpers";
import { checkOrganizationAccess } from "../helpers";
import { checkWorkspaceAccess } from "../helpers";

// List messages schema
export const ListMessagesSchema = z.object({
  limit: z.string().optional(),
  offset: z.string().optional(),
});
export type ListMessagesSchema = z.infer<typeof ListMessagesSchema>;

/**
 * Route: Get messages for a conversation
 */
const getMessagesRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "get",
    path: "/conversations/:conversationId/messages",
    tags: ["Chat"],
    summary: "Get conversation messages",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
        conversationId: ConversationId,
      }),
      query: ListMessagesSchema,
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "Messages retrieved successfully",
        content: {
          "application/json": {
            schema: z.array(SelectMessageSchema),
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    try {
      const { conversationId } = c.req.valid("param");
      const { limit: limitString = "50", offset: offsetString = "0" } =
        c.req.valid("query");
      const db = c.get("db");
      const workspaceId = c.req.valid("param").workspaceId;

      const limit = Number(limitString);
      const offset = Number(offsetString);

      // Get messages for the conversation
      const messagesList = await db.query.messages.findMany({
        where: and(
          eq(messages.conversationId, conversationId),
          eq(messages.workspaceId, workspaceId),
        ),
        orderBy: [asc(messages.createdAt)],
        limit,
        offset,
      });

      return c.json(messagesList, 200);
    } catch (error) {
      c.get("logger").error({
        msg: "Error getting messages",
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

// Create and export the message routes
const messageRoutes = new OpenAPIHono()
  .basePath(`${WORKSPACE_PATH}/chat/conversations/:conversationId/messages`)
  .use(
    `${WORKSPACE_PATH}/chat/conversations/:conversationId/messages`,
    checkWorkspaceAccess,
  )
  .use(
    `${WORKSPACE_PATH}/chat/conversations/:conversationId/messages`,
    checkOrganizationAccess,
  )
  .route("/", getMessagesRoute);

export { messageRoutes };
