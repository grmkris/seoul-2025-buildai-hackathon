import type { db } from "@/db/db";
import type { ConversationId, WorkspaceId, CustomerId } from "typeid";
import type { Logger } from "logger";
import { createChatHistoryService } from "@/routes/chat/chatHistoryService";
import { createAiClient } from "ai";
import { env } from "@/env";
import type { Message } from "ai";
import { typeIdGenerator } from "typeid";
import { appendResponseMessages, createDataStream } from "ai";
import { createOgrodjeClientTools } from "./ogrodjeAgentTools";
import { createPaymentAgentTools } from "./paymentAgentTools";

const system_prompt = `You are a helpful assistant operating on a pay-per-question model. Your primary function is to assist users by answering questions and utilizing the tools available to you accurately and reliably, **after ensuring the user has paid for access**.

**PAYMENT & QUESTION ACCESS RULES:**

* **Payment Required:** Users **MUST** pay an access fee **BEFORE** asking questions.
* **Cost & Quota:** The fee is **0.1 xUSD**, which grants the user **3 questions**.
* **Operational Flow:**
  * **STEP 1: ALWAYS check payment status first before answering ANY question**
  * **STEP 2: If no valid payment exists, ALWAYS call tool to request payment**
  * **STEP 3: Only after payment validation can you answer questions, and ALWAYS track the count**

**CRITICAL TOOL CALLING REQUIREMENTS:**

* **MANDATORY TOOL USAGE:** You MUST EXECUTE tool calls using the proper function calling syntax. NEVER describe, simulate, or pretend to call tools.
* **ZERO EXCEPTIONS:** There are NO scenarios where you should mention payments, validation, or Ogrodje data without calling the corresponding tool.

**PAYMENT FLOW SPECIFICS:**

1. **Initial Payment Request:**
   * When user first engages or asks a question without prior payment:
   * **YOU MUST EXECUTE** requestPaymentTool with:
     * **amount: 0.1**
     * **currencySymbol: 'xUSD'**
     * **reason: 'Question Access Fee'**
   * After tool returns: "To ask questions, please complete the payment of 0.1 xUSD for 3 questions. Your Payment Intent ID is \`[paymentIntentId]\`. Let me know once you've paid."

2. **Payment Validation:**
   * When user indicates payment completion:
   * **YOU MUST EXECUTE** validatePaymentTool with the paymentIntentId
   * After successful validation: "Thank you! Payment confirmed. You now have 3 questions available. What would you like to ask?"

3. **Question Tracking:**
   * After each successful answer: "You have [X] questions remaining."
   * When 3 questions have been used: "You've used all your questions. To continue, a new payment is required." THEN **IMMEDIATELY EXECUTE** requestPaymentTool again.

**IMPORTANT BEHAVIOR RULES:**

1. **Tool Results Are Authoritative:** Base responses ENTIRELY on tool output. Never fabricate information.
2. **Clear Error Communication:** If a tool returns an error, convey it clearly to the user.
3. **Context Awareness:** Always retrieve the paymentIntentId from previous responses; never ask the user for it.
4. **Concise UI Integration:** Your text should be brief and let the renderers handle displaying detailed information.
`;
// You can now use the system_prompt variable in your JavaScript code.
// Example usage:
// console.log(system_prompt);
// Optional: Log to console to verify
// console.log(system_prompt);

export const createSimpleAgent = (props: {
  db: db;
  workspaceId: WorkspaceId;
  conversationId: ConversationId;
  customerId: CustomerId;
  logger: Logger;
  // TODO: Add state management for payment status and remaining questions
  // e.g., getPaymentStatus: () => Promise<{ paid: boolean; questionsRemaining: number }>,
  // e.g., decrementQuestionCount: () => Promise<void>,
  // e.g., recordPaymentSuccess: () => Promise<void>,
}) => {
  const { db, workspaceId, conversationId, customerId, logger } = props;

  const chatHistoryService = createChatHistoryService({
    db,
    workspaceId,
    conversationId,
    customerId,
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
    // TODO: Here, before calling the AI, you would ideally:
    // 1. Check the user's current payment status and remaining questions for this conversation.
    // 2. Potentially modify the message history or add a preliminary system message
    //    based on the status, although the main prompt now handles the logic flow.
    // Example:
    // const { paid, questionsRemaining } = await props.getPaymentStatus();
    // if (!paid && message.content /* implies a question */) {
    //   // Maybe force the agent towards payment flow? Less ideal than prompt handling.
    // }

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
          maxSteps: 25, // May need adjustment if payment flow adds steps
          model: aiClient.getModel({
            provider: "anthropic",
            modelId: "claude-3-7-sonnet-20250219", // Consider potential cost/speed implications of more complex prompts
          }),
          tools: {
            ...createOgrodjeClientTools({ logger }),
            ...createPaymentAgentTools({
              logger,
              db,
              customerId,
              conversationId,
            }),
          },
          system: system_prompt,
          messages: messagesFromDb,
          toolCallStreaming: true,
          onFinish: (resultContext) => {
            logger.debug({
              msg: "Agent finished",
              resultContext,
              conversationId,
            });
            // TODO: If the last step involved answering a question, decrement count here
            // This requires analyzing resultContext.text or tool calls.
            // if (/* answered a question successfully */) {
            //    await props.decrementQuestionCount();
            // }
          },
          onStepFinish: async (result) => {
            logger.debug({
              msg: "Agent step finished",
              conversationId,
              result,
            });

            // TODO: If a payment validation step was successful, record it and set initial question count
            // This requires analyzing result.toolResults or result.response messages.
            // if (/* payment validated successfully */) {
            //    await props.recordPaymentSuccess(); // Sets questions to 3
            // }

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
              error:
                error instanceof Error ? error.message : JSON.stringify(error),
              stack: error instanceof Error ? error.stack : undefined,
              conversationId,
            });
          },
          experimental_generateMessageId: () => typeIdGenerator("message"),
        });

        result.mergeIntoDataStream(dataStream);
      },
    });
    return dataStream;
  };

  return {
    sendMessage,
  };
};
