import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { createCommonErrorSchema, createOpenAPIRoute } from "../helpers";
import { GetConversationSchema } from "../chat/conversationRoutes";
import { ConversationId, typeIdGenerator, type UserId, WorkspaceId } from "typeid";
import { conversations, messages, usersTable } from "@/db/schema/chat/chat.db";
import { eq } from "drizzle-orm";
import type { ContextVariables } from "@/types";
import { PUBLIC_PATH } from "@/utils";
import { appendResponseMessages, createAiClient, createDataStream, type Message, MessageSchema } from "ai";
import { createChatHistoryService } from "../chat/chatHistoryService";
import { env } from "@/env";
import { stream } from "hono/streaming";
import { getAddress } from "viem";

// Schema for wallet address validation
const WalletAddressSchema = z.string().refine(
  (addr) => {
    try {
      getAddress(addr);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid wallet address format" },
);

const initializeWidget = createOpenAPIRoute().openapi(
  createRoute({
    method: "post",
    path: "",
    tags: ["Public"],
    summary: "Initialize widget: find or create user and conversation",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              walletAddress: WalletAddressSchema,
              workspaceId: WorkspaceId,
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Conversation retrieved or created successfully",
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
    const logger = c.get("logger");
    const { walletAddress: rawWalletAddress, workspaceId } = c.req.valid("json");
    const db = c.get("db");
    const requestId = c.get("requestId");

    try {
      const walletAddress = getAddress(rawWalletAddress);

      let user = await db.query.usersTable.findFirst({
        where: eq(usersTable.walletAddress, walletAddress),
      });

      let userId: UserId;
      if (!user) {
        logger.info({
          msg: "User not found, creating new one.",
          walletAddress,
          requestId,
        });
        userId = typeIdGenerator("user");
        const newUser = await db
          .insert(usersTable)
          .values({
            id: userId,
            walletAddress,
          })
          .returning();
        user = newUser[0];
        if (!user) throw new Error("Failed to create user.");
        userId = user.id;
         logger.info({ msg: "Created new user", userId, walletAddress, requestId });
      } else {
        userId = user.id;
        logger.info({ msg: "Found existing user", userId, walletAddress, requestId });
      }

      let conversation = await db.query.conversations.findFirst({
        where: (table, { and }) => and(eq(table.createdBy, userId), eq(table.workspaceId, workspaceId)),
        with: {
          messages: {
            orderBy: (messages, { asc }) => [asc(messages.createdAt)],
          },
        },
      });

      if (!conversation) {
        logger.info({
          msg: "Conversation not found for this user/workspace, creating new one.",
          userId,
          workspaceId,
          requestId,
        });

        const newConversationId = typeIdGenerator("conversation");
        const insertedConversation = await db
          .insert(conversations)
          .values({
            id: newConversationId,
            createdBy: userId,
            updatedBy: userId,
            title: `Chat with ${walletAddress.slice(0, 6)}...`,
            workspaceId: workspaceId,
          })
          .returning();

        if (!insertedConversation || insertedConversation.length === 0) {
          throw new Error("Failed to insert new conversation");
        }
         logger.info({ msg: "Created new conversation", conversationId: newConversationId, userId, workspaceId, requestId });

        const firstMessageId = typeIdGenerator("message");
        const firstMessageContent = {
          id: firstMessageId,
          role: "assistant",
          content: "Who are you?",
        } satisfies Message;

        await db.insert(messages).values({
          id: firstMessageId,
          conversationId: newConversationId,
          message: firstMessageContent,
          createdBy: userId,
          updatedBy: userId,
          workspaceId: workspaceId,
        });

        logger.info({
          msg: "Created initial message for new conversation",
          messageId: firstMessageId,
          conversationId: newConversationId,
          requestId,
        });

        conversation = await db.query.conversations.findFirst({
          where: eq(conversations.id, newConversationId),
          with: {
            messages: {
              orderBy: (messages, { asc }) => [asc(messages.createdAt)],
            },
          },
        });

        if (!conversation) {
          throw new Error("Failed to fetch newly created conversation");
        }
      } else {
         logger.info({ msg: "Found existing conversation", conversationId: conversation.id, userId, workspaceId, requestId });
      }

      const validatedData = GetConversationSchema.safeParse(conversation);
      if (!validatedData.success) {
        logger.error({
          msg: "Fetched conversation data mismatch schema",
          error: validatedData.error,
          requestId,
        });
        throw new Error("Conversation data validation failed.");
      }
      return c.json(validatedData.data, 200);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error({
        msg: "Error initializing widget",
        error: errorMsg,
        stack: error instanceof Error ? error.stack : undefined,
        requestId,
      });
      return c.json(
        {
          message: `Internal server error: ${errorMsg}`,
          requestId: c.get("requestId"),
        },
        500,
      );
    }
  },
);

const getConversationRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "get",
    path: "",
    tags: ["Public"],
    summary: "Get conversation details by ID",
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
    const logger = c.get("logger");
    const { conversationId } = c.req.valid("param");
    const db = c.get("db");
    const requestId = c.get("requestId");

    logger.info({ msg: "Getting conversation", conversationId, requestId });

    try {
      const conversation = await db.query.conversations.findFirst({
        where: eq(conversations.id, conversationId),
        with: {
          messages: {
            orderBy: (messages, { asc }) => [asc(messages.createdAt)],
          },
        },
      });

      if (!conversation) {
        logger.warn({ msg: "Conversation not found", conversationId, requestId });
        return c.json({ message: "Conversation not found", requestId }, 404);
      }

      logger.info({ msg: "Found conversation", conversationId: conversation.id, requestId });
      const validatedData = GetConversationSchema.safeParse(conversation);
      if (!validatedData.success) {
        logger.error({ msg: "Fetched conversation data mismatch schema", error: validatedData.error, requestId });
        throw new Error("Conversation data validation failed.");
      }
      return c.json(validatedData.data, 200);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error({
        msg: "Error getting conversation",
        conversationId,
        error: errorMsg,
        stack: error instanceof Error ? error.stack : undefined,
        requestId,
      });
      return c.json(
        {
          message: `Internal server error: ${errorMsg}`,
          requestId,
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
    summary: "Get all conversations (System-wide)",
    responses: {
      200: {
        description: "All conversations retrieved successfully",
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
      msg: "Getting ALL conversations",
      requestId,
    });

    const allConversations = await db.query.conversations.findMany({
       with: {
          messages: {
            orderBy: (messages, { asc }) => [asc(messages.createdAt)],
          },
        },
    });

    const validatedConversations = z.array(GetConversationSchema).safeParse(allConversations);
    if (!validatedConversations.success) {
       logger.error({ msg: "Fetched conversations data mismatch schema", error: validatedConversations.error, requestId });
       return c.json({ message: "Failed to validate conversations data", requestId}, 500);
    }

    return c.json(validatedConversations.data, 200);
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
        columns: {
            workspaceId: true,
            createdBy: true,
        }
      });

      if (!conversation) {
         logger.warn({ msg: "Conversation not found for sending message", conversationId, requestId });
        return c.json({ message: "Conversation not found", requestId }, 404);
      }

      const { workspaceId, createdBy: userId } = conversation;

      const chatHistoryService = createChatHistoryService({
        db,
        workspaceId,
        conversationId,
        userId,
        logger,
      });

      await chatHistoryService.addUserMessage(userMessage);

      const history = await chatHistoryService.getConversationMessages();

      const aiClient = createAiClient({
        logger,
        providerConfigs: {
          anthropicApiKey: env.ANTHROPIC_API_KEY,
          googleGeminiApiKey: env.GOOGLE_GEMINI_API_KEY,
        },
      });

      const messagesFromDb = history.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
      }));

      const dataStream = createDataStream({
        execute: async (dataStream) => {
          const result = aiClient.streamText({
            model: aiClient.getModel({
              provider: "google",
              modelId: "gemini-1.5-flash-latest",
            }),
            messages: messagesFromDb,
            toolCallStreaming: true,
            onFinish: (result) => {
              const newMessages = appendResponseMessages({
                messages: messagesFromDb,
                responseMessages: result.response.messages,
              });
              const justNewMessages = newMessages.filter(
                (message) => !messagesFromDb.some((m) => m.id === message.id),
              );
              logger.info({
                msg: "Agent finished, just new messages:",
                newMessagesCount: justNewMessages.length,
                conversationId,
                requestId,
              });
            },
            onStepFinish: async (result) => {
              const newMessagesAndOld = appendResponseMessages({
                messages: messagesFromDb,
                responseMessages: result.response.messages,
              });
    
              const justNewMessages = newMessagesAndOld.filter(
                (message) => !messagesFromDb.some((m) => m.id === message.id),
              );
    
              if (justNewMessages.length > 0) {
                 try {
                  logger.debug({
                    msg: "Agent step finished, saving new messages",
                    newMessagesCount: justNewMessages.length,
                    conversationId,
                    requestId,
                   });
                   await chatHistoryService.addAgentMessages(justNewMessages);
                   messagesFromDb.push(...justNewMessages);
                 } catch (error) {
                  logger.error({
                    msg: "Error saving new messages",
                    error: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined,
                  });
                 }
              }
            },
            onError: (error) => {
              logger.error({
                msg: "AI streaming error",
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                conversationId,
                requestId,
              });
            },
            experimental_generateMessageId: () => typeIdGenerator("message"),
          });
    
          result.mergeIntoDataStream(dataStream);
        }
      });

      c.header("X-Vercel-AI-Data-Stream", "v1");
      c.header("Content-Type", "text/plain; charset=utf-8");
      return stream(c, async (stream) => {
          await stream.pipe(dataStream);
      });
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
      msg: "Public route accessed",
      path: c.req.path,
      method: c.req.method,
    });
    await next();
  })
  .basePath(`${PUBLIC_PATH}`)
  .route("/initialize", initializeWidget)
  .route("/conversations", getConversationsRoute)
  .route("/conversations/:conversationId", getConversationRoute)
  .route("/conversations/:conversationId/messages", sendNewMessageRoute);

export type PublicRoutes = typeof publicRoutes;

