import { messages } from "@/db/schema/chat/chat.db";
import { SelectMessageSchema } from "@/db/schema/chat/chat.zod";
import { env } from "@/env";
import { WORKSPACE_PATH } from "@/utils";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { MessageSchema, createDataStream } from "ai";
import { createAiClient } from "ai";
import { and, asc, eq } from "drizzle-orm";
import { stream } from "hono/streaming";
import { ConversationId, MessageId, OrganizationId, WorkspaceId } from "typeid";
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
import { createChatHistoryService } from "./chatHistoryService";

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

/**
 * Route: Update a message
 */
const updateMessageRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "patch",
    path: "/conversations/:conversationId/messages/:messageId",
    tags: ["Chat"],
    summary: "Update message",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
        conversationId: ConversationId,
        messageId: MessageId,
      }),
      body: createJsonSchema(
        z.object({
          content: z.string(),
        }),
      ),
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "Message updated successfully",
        content: {
          "application/json": {
            schema: SelectMessageSchema,
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    try {
      const { conversationId, messageId } = c.req.valid("param");
      const { content } = c.req.valid("json");
      const db = c.get("db");
      const session = validateAuth(c);
      const workspaceId = c.req.valid("param").workspaceId;
      const requestId = c.get("requestId");

      // Check if the message exists and belongs to the user
      const existingMessage = await db.query.messages.findFirst({
        where: and(
          eq(messages.id, messageId),
          eq(messages.conversationId, conversationId),
          eq(messages.workspaceId, workspaceId),
        ),
      });

      if (!existingMessage) {
        return c.json({ message: "Message not found", requestId }, 404);
      }

      if (existingMessage.createdBy !== session.memberId) {
        return c.json(
          {
            message: "You can only edit your own messages",
            requestId,
          },
          403,
        );
      }

      // Get the existing message for updating
      const messageData = { ...existingMessage.message };

      // Update the content in the message JSON
      if (typeof messageData === "object" && messageData !== null) {
        // @ts-ignore - we know this property exists
        messageData.content = content;
      }

      // Update the message
      const updatedMessage = await db
        .update(messages)
        .set({
          message: messageData,
          updatedBy: session.memberId,
        })
        .where(
          and(
            eq(messages.id, messageId),
            eq(messages.conversationId, conversationId),
            eq(messages.workspaceId, workspaceId),
            eq(messages.createdBy, session.memberId),
          ),
        )
        .returning();

      if (!updatedMessage.length) {
        return c.json({ message: "Failed to update message", requestId }, 500);
      }

      return c.json(updatedMessage[0], 200);
    } catch (error) {
      c.get("logger").error({
        msg: "Error updating message",
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
 * Route: Delete a message
 */
const deleteMessageRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "delete",
    path: "/conversations/:conversationId/messages/:messageId",
    tags: ["Chat"],
    summary: "Delete message",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
        conversationId: ConversationId,
        messageId: MessageId,
      }),
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "Message deleted successfully",
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
      const { conversationId, messageId } = c.req.valid("param");
      const db = c.get("db");
      const session = validateAuth(c);
      const workspaceId = c.req.valid("param").workspaceId;
      const requestId = c.get("requestId");

      // Check if the message exists and belongs to the user
      const existingMessage = await db.query.messages.findFirst({
        where: and(
          eq(messages.id, messageId),
          eq(messages.conversationId, conversationId),
          eq(messages.workspaceId, workspaceId),
        ),
      });

      if (!existingMessage) {
        return c.json({ message: "Message not found", requestId }, 404);
      }

      if (existingMessage.createdBy !== session.memberId) {
        return c.json(
          {
            message: "You can only delete your own messages",
            requestId,
          },
          403,
        );
      }

      // Delete the message
      const deletedMessage = await db
        .delete(messages)
        .where(
          and(
            eq(messages.id, messageId),
            eq(messages.conversationId, conversationId),
            eq(messages.workspaceId, workspaceId),
            eq(messages.createdBy, session.memberId),
          ),
        )
        .returning();

      if (!deletedMessage.length) {
        return c.json({ message: "Failed to delete message", requestId }, 500);
      }

      return c.json({ message: "Message deleted successfully" }, 200);
    } catch (error) {
      c.get("logger").error({
        msg: "Error deleting message",
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

const sendNewMessageRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "post",
    path: "",
    tags: ["Chat"],
    summary: "Send message and get streaming AI response",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
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
    const { conversationId, workspaceId } = c.req.valid("param");
    const { message: userMessage } = c.req.valid("json");
    const db = c.get("db");
    const session = validateAuth(c);
    const requestId = c.get("requestId");

    logger.info({
      msg: "Sending message",
      conversationId,
      memberId: session.memberId,
      contentPreview: userMessage.content.substring(0, 50),
    });

    if (!session.memberId) {
      return c.json(
        { message: "Unauthorized", requestId: c.get("requestId") },
        401,
      );
    }
    try {
      // 1. Initialize Chat History Service
      const chatHistoryService = createChatHistoryService({
        db,
        workspaceId,
        memberId: session.memberId,
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
  .route("/", getMessagesRoute)
  .route("/", sendNewMessageRoute)
  .route("/:messageId", updateMessageRoute)
  .route("/:messageId", deleteMessageRoute);

export { messageRoutes };
