import type { db } from "@/db/db";
import type { UserId, ConversationId, WorkspaceId } from "typeid";
import type { Logger } from "logger";
import { createChatHistoryService } from "@/routes/chat/chatHistoryService";
import { createAiClient } from "ai";
import { env } from "@/env";
import type { Message } from "ai";
import { typeIdGenerator } from "typeid";
import { appendResponseMessages, createDataStream } from "ai";
import { createOgrodjeClientTools } from "./ogrodjeAgentTools";
import { createPaymentAgentTools } from "./paymentAgentTools";

export const createSimpleAgent = (props: {
  db: db,
  workspaceId: WorkspaceId,
  conversationId: ConversationId,
  userId: UserId,
  logger: Logger,
}) => {
  const { db, workspaceId, conversationId, userId, logger } = props;

  const chatHistoryService = createChatHistoryService({
    db,
    workspaceId,
    conversationId,
    userId,
    logger,
  });

  const aiClient = createAiClient({
    logger,
    providerConfigs: {
      anthropicApiKey: env.ANTHROPIC_API_KEY,
      googleGeminiApiKey: env.GOOGLE_GEMINI_API_KEY,
    },
  });

  const sendMessage = async (message: Message) => {
    await chatHistoryService.addUserMessage(message);

    const history = await chatHistoryService.getConversationMessages();

    const messagesFromDb = history.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    }));

    const dataStream = createDataStream({
      execute: async (dataStream) => {
        const result = aiClient.streamText({
          maxSteps: 25,
          model: aiClient.getModel({
            provider: "google",
            modelId: "gemini-2.5-pro-exp-03-25",
          }),
          tools: {
            ...createOgrodjeClientTools({ logger }),
            ...createPaymentAgentTools({ logger, db, userId, conversationId }),
          },
          system: "You are a helpful assistant that can answer general questions and you can use the tools to make your life easier. You can also use the tools to get information about the events and meetups.",
          messages: messagesFromDb,
          toolCallStreaming: true,
          onFinish: (result) => {
            logger.debug({
              msg: "Agent finished",
              conversationId,
            });
          },
          onStepFinish: async (result) => {
            logger.debug({
              msg: "Agent step finished",
              conversationId,
              result,
            });
            const newMessagesAndOld = appendResponseMessages({
              messages: messagesFromDb,
              responseMessages: result.response.messages,
            });

            const justNewMessages = newMessagesAndOld.filter(
              (message) => !messagesFromDb.some((m) => m.id === message.id),
            );
            await chatHistoryService.addAgentMessages(justNewMessages);
          },
          onError: (error) => {
            logger.error({
              msg: "AI streaming error",
              error: error instanceof Error ? error.message : JSON.stringify(error),
              stack: error instanceof Error ? error.stack : undefined,
              conversationId,
            });
          },
          experimental_generateMessageId: () => typeIdGenerator("message"),
        });

        result.mergeIntoDataStream(dataStream);
      }
    });
    return dataStream;
  };

  return {
    sendMessage,
  };
};