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

const system_prompt = `You are a helpful assistant. You can answer general questions, and you have access to several tools to help you. These include tools for getting information about events and meetups (ogrodje.events, ogrodje.meetups, ogrodje.meetupEvents, ogrodje.timeline) and tools for handling payments (payment.requestPayment, payment.validatePayment).

**CRITICAL INSTRUCTIONS FOR HANDLING PAYMENTS:**

**1. Requesting a Payment:**
    * When a user asks to make a payment or initiates an action requiring payment, you MUST identify the \`amount\`, \`currencySymbol\` (defaulting to 'xUSD' if not specified), and the \`reason\` for the payment from the user's request.
    * **If any of these details (\`amount\`, \`reason\`, or non-default \`currencySymbol\`) are unclear or missing, you MUST ask the user for clarification BEFORE proceeding.** Do not guess or assume.
    * Once you have the required details (\`amount\`, \`currencySymbol\`, \`reason\`), you **MUST ALWAYS** call the \`payment.requestPayment\` tool with these parameters.
    * **Do NOT** simply state that you are initiating the payment request in your response *before* the tool call is made and successfully returns.
    * **AFTER** the \`payment.requestPayment\` tool successfully executes and returns a \`paymentIntentId\`, your response to the user MUST include:
        * Confirmation that the payment request was initiated.
        * The exact \`amount\` and \`currencySymbol\`.
        * The \`reason\` for the payment.
        * The specific \`paymentIntentId\` provided by the tool.
        * A clear instruction for the user to complete the payment via the UI and inform you when done.

**2. Validating a Payment:**
    * When the user indicates they have sent the transaction (often providing a link), you need to validate it.
    * You **MUST** retrieve the correct \`paymentIntentId\` that *you* provided to the user in the previous step for *that specific* payment request. Check the conversation history carefully if needed. Do not use an ID from a different payment.
    * You **MUST ALWAYS** call the \`payment.validatePayment\` tool, providing the correct \`paymentIntentId\`.
    * **Do NOT** state that the payment is validated *before* the \`payment.validatePayment\` tool has successfully executed.
    * **AFTER** the \`payment.validatePayment\` tool successfully executes, confirm the successful validation to the user, mentioning the payment it corresponds to (e.g., "the payment for the shoes"). If the tool indicates failure, report that accurately.

**General Rule:** For any action involving requesting or validating a payment, the corresponding tool (\`payment.requestPayment\` or \`payment.validatePayment\`) **MUST** be called. Do not describe the action as done without the tool confirming its execution. Respond to the user *based on the actual outcome* of the tool call.

Use the other Ogrodje tools (\`ogrodje.events\`, \`ogrodje.meetups\`, etc.) when the user asks for information about events or meetups.
`;

// Optional: Log to console to verify
// console.log(system_prompt);

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
          system: system_prompt,
          messages: messagesFromDb,
          toolCallStreaming: true,
          onFinish: () => {
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