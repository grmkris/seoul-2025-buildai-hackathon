import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { commonHeaderSchema, createCommonErrorSchema, createOpenAPIRoute } from "../helpers";
import { GetConversationSchema } from "../chat/conversationRoutes";
import { ConversationId } from "typeid";
import { conversations } from "@/db/schema/chat/chat.db";
import { eq } from "drizzle-orm";
import type { ContextVariables } from "@/types";
import { PUBLIC_PATH } from "@/utils";
import { createAiClient, createDataStream, MessageSchema } from "ai";
import { createChatHistoryService } from "../chat/chatHistoryService";
import { env } from "@/env";
import { stream } from "hono/streaming";

// For publicRoutes, try defining getConversationRoute with the constructor:
const getConversationRoute = createOpenAPIRoute().openapi(
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


const getConversationsRoute = createOpenAPIRoute().openapi(
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

const sendNewMessageRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "post",
    path: "",
    tags: ["Chat"],
    summary: "Send message and get streaming AI response",
    request: {
      params: z.object({
        conversationId: ConversationId,
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              message: MessageSchema,
            }),
          },
        },
      },
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "Streaming AI response",
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    const logger = c.get("logger");
    const { conversationId } = c.req.valid("param");
    const { message: userMessage } = c.req.valid("json");
    const db = c.get("db");
    const requestId = c.get("requestId");

    logger.info({
      msg: "Sending message",
      conversationId,
      contentPreview: userMessage.content.substring(0, 50),
    });

    try {

      const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.id, conversationId),
      });

      if (!conversation) {
        return c.json({ message: "Conversation not found", requestId }, 404);
      }

      // 1. Initialize Chat History Service
      const chatHistoryService = createChatHistoryService({
        db,
        workspaceId: conversation.workspaceId,
        conversationId,
      });

      // 2. Add user message to DB
      await chatHistoryService.addUserMessage(userMessage);

      // 3. Fetch conversation history
      const history = await chatHistoryService.getConversationMessages();

      // 4. Initialize AI Provider (Example: OpenAI)
      const aiClient = createAiClient({
        logger,
        providerConfigs: {
          anthropicApiKey: env.ANTHROPIC_API_KEY,
          googleGeminiApiKey: env.GOOGLE_GEMINI_API_KEY,
        },
      });

      // Ensure history only contains role and content
      const preparedHistory = history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Start streaming response
      const dataStream = createDataStream({
        execute: async (dataStreamWriter) => {
          // Process with agent
          // 5. Stream response from AI
          const result = aiClient.streamText({
            model: aiClient.getModel({
              provider: "google",
              modelId: "gemini-2.0-flash-001",
            }), // Use aiClient to get the model
            messages: preparedHistory, // Pass the formatted history
          });

          result.mergeIntoDataStream(dataStreamWriter);
        },
        onError: (error) => {
          logger.error({
            msg: "Streaming error",
            error,
            conversationId,
          });
          return error instanceof Error ? error.message : String(error);
        },
      });

      // Mark the response as a v1 data stream
      c.header("X-Vercel-AI-Data-Stream", "v1");
      c.header("Content-Type", "text/plain; charset=utf-8");

      return stream(c, (stream) => stream.pipe(dataStream));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error({
        msg: "Error sending message or streaming AI response",
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        conversationId,
        requestId,
      });
      return c.json(
        {
          message: `Failed to process message: ${errorMessage}`,
          requestId,
        },
        500,
      );
    }
  },
);


export const publicRoutes = new OpenAPIHono<{
  Variables: ContextVariables;
}>()
  .use("*", async (c, next) => {
    const logger = c.get("logger");
    logger.info({
      msg: "Public route",
      path: c.req.path,
    });
    await next();
  })
  .basePath(`${PUBLIC_PATH}/conversations`)
  .route("/", getConversationsRoute)
  .route("/:conversationId", getConversationRoute)
  .route("/:conversationId/messages", sendNewMessageRoute);

export type PublicRoutes = typeof publicRoutes;
