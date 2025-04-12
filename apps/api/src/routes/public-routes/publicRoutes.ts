import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { createCommonErrorSchema } from "../helpers";
import { GetConversationSchema } from "../chat/conversationRoutes";
import { ConversationId } from "typeid";
import { conversations } from "@/db/schema/chat/chat.db";
import { eq } from "drizzle-orm";
import type { ContextVariables } from "@/types";
import { PUBLIC_PATH } from "@/utils";

// For publicRoutes, try defining getConversationRoute with the constructor:
const getConversationRoute = new OpenAPIHono<{
  Variables: ContextVariables;
}>().openapi(
  createRoute({
    method: "get",
    path: "/:conversationId",
    tags: ["Public"],
    summary: "Get conversation details",
    request: {
      params: z.object({
        conversationId: ConversationId,
      }),
    },
    responses: {
      200: {
        description: "Conversation retrieved successfully",
        content: {
          "application/json": {
            schema: GetConversationSchema,
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
      const requestId = c.get("requestId");

      // Get conversation - Removed audit history query
      const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.id, conversationId),
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

const getConversationsRoute = new OpenAPIHono<{
  Variables: ContextVariables;
}>().openapi(
  createRoute({
    method: "get",
    path: "",
    tags: ["Public"],
    summary: "Get all conversations",
    responses: {
      200: {
        description: "Conversations retrieved successfully",
        content: {
          "application/json": {
            schema: z.array(GetConversationSchema),
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    const db = c.get("db");
    const requestId = c.get("requestId");

    const logger = c.get("logger");

    logger.info({
      msg: "Getting all conversations",
      requestId,
    });

    const conversations = await db.query.conversations.findMany();

    return c.json(conversations, 200);
  },
);

export const publicRoutes = new OpenAPIHono<{
  Variables: ContextVariables;
}>()
  .basePath(`${PUBLIC_PATH}/conversations`)
  .route("/", getConversationsRoute)
  .route("/:conversationId", getConversationRoute);

export type PublicRoutes = typeof publicRoutes;
