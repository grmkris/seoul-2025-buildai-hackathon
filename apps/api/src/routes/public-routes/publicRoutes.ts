import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { createCommonErrorSchema, createOpenAPIRoute } from "../helpers";
import { GetConversationSchema } from "../chat/conversationRoutes";
import { ConversationId } from "typeid";
import { conversations } from "@/db/schema/chat/chat.db";
import { eq } from "drizzle-orm";

export const PUBLIC_ROUTES_PATH = "/public" as const;
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
        conversationId: ConversationId,
      }),
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

const publicRoutes = new OpenAPIHono().route(
  "/conversations/:conversationId",
  getConversationRoute,
);

export { publicRoutes };
