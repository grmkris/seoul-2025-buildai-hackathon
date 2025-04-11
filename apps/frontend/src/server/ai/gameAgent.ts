import {
  type DataStreamWriter,
  type Message,
  appendClientMessage,
  appendResponseMessages,
} from "ai";
import { typeIdGenerator, type UserId } from "@/server/db/typeid";
import type { AiClient } from "./aiClient";
import type { ChatHistoryService } from "./chatHistoryService";
import { picPromptGenerator } from "./prompts/01-Pic";
import { levelProgressionTable } from "../db/chat/chat.db";
import type { db as DbType } from "../db/db";
import { sheetMakerPromptGenerator } from "./prompts/02-SheetMaker";
import { eq } from "drizzle-orm";
import { level1PromptGenerator } from "./prompts/03-Level1";
import { level2PromptGenerator } from "./prompts/04-Level2";
import { createAgentTools } from "./agentTools";

const systemPrompt = async (props: { db: DbType; userId: UserId }) => {
  const { db, userId } = props;
  const levelProgression = await db.query.levelProgressionTable.findMany({
    where: eq(levelProgressionTable.userId, userId),
  });

  // if there is no level progression, return the pic prompt
  if (levelProgression.length === 0) {
    return picPromptGenerator();
  }

  const latestLevel = levelProgression[levelProgression.length - 1];

  switch (latestLevel.data.level) {
    case "pic": {
      return sheetMakerPromptGenerator();
    }
    case "sheet": {
      return level1PromptGenerator({
        characterSheet: latestLevel.data.characterSheet,
      });
    }
    case "level": {
      if (latestLevel.data.levelIndex === 0) {
        return level2PromptGenerator({
          characterSheet: latestLevel.data.characterSheet,
        });
      }
      return level2PromptGenerator({
        characterSheet: latestLevel.data.characterSheet,
      });
    }
  }
};

export const createGameAgent = (props: {
  deps: {
    aiClient: AiClient;
    db: DbType;
  };
  userId: UserId;
  chainId: number;
}) => {
  const { aiClient, db } = props.deps;
  const { userId, chainId } = props;

  const tools = createAgentTools({
    deps: {
      aiClient,
      db,
    },
    userId,
    chainId,
  });

  return {
    queryStream: async (params: {
      message: Message;
      chatHistoryService: ChatHistoryService;
      onError?: (error: { error: unknown }) => void;
      dataStreamWriter: DataStreamWriter;
    }) => {
      const { message, chatHistoryService, onError } = params;

      const existingConversation =
        await chatHistoryService.getConversationMessages();
      await chatHistoryService.addUserMessage(message);

      const messagesForAi = appendClientMessage({
        messages: existingConversation,
        message: message,
      });

      console.log({
        messagesForAi: messagesForAi,
      });

      const result = aiClient.streamText({
        tools,
        toolCallStreaming: true,
        onStepFinish: async (result) => {
          const newMessagesAndOld = appendResponseMessages({
            messages: messagesForAi,
            responseMessages: result.response.messages,
          });

          const justNewMessages = newMessagesAndOld.filter(
            (m) => !messagesForAi.map((orig) => orig.id).includes(m.id),
          );

          console.debug({
            msg: "Agent step finished, new messages:",
            justNewMessages,
          });

          await chatHistoryService.addAgentMessages(justNewMessages);
        },
        onError: (error) => {
          console.error({
            msg: "Agent error",
            error,
          });
          onError?.(error);
        },
        maxSteps: 5,
        messages: messagesForAi,
        system: await systemPrompt({ db, userId }),
        model: aiClient.getModel({
          modelId: "gemini-2.5-pro-exp-03-25",
          provider: "google",
        }),
        experimental_generateMessageId: () => typeIdGenerator("message"),
      });

      return result;
    },
  };
};

export type GameAgent = ReturnType<typeof createGameAgent>;
