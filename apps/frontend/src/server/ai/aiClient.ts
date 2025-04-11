import {
  experimental_generateImage,
  generateText as generateTextAi,
  streamText as streamTextAi,
  generateObject as generateObjectAi,
  streamObject as streamObjectAi,
} from "ai";
import { type AIModelConfig, getModel } from "./providers";

export interface AiClientConfig {
  providerConfigs: {
    googleGeminiApiKey: string;
  };
}
export type AiProviderCredentials = AiClientConfig["providerConfigs"];

export const createAiClient = (config: AiClientConfig) => {
  return {
    getModel: (aiConfig: AIModelConfig) => {
      switch (aiConfig.provider) {
        case "google":
          return getModel({
            modelConfig: aiConfig,
            providerConfig: {
              provider: "google",
              apiKey: config.providerConfigs.googleGeminiApiKey,
            },
          });
        default:
          throw new Error(`Unsupported provider: ${JSON.stringify(aiConfig)}`);
      }
    },
    generateObject: generateObjectAi,
    streamObject: streamObjectAi,
    generateText: generateTextAi,
    streamText: streamTextAi,
    generateImage: experimental_generateImage,
  };
};

export type AiClient = ReturnType<typeof createAiClient>;
