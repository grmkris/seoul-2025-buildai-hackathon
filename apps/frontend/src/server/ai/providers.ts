import {
  type GoogleGenerativeAIProvider,
  createGoogleGenerativeAI,
} from "@ai-sdk/google";
import type { LanguageModel } from "ai";
import { z } from "zod";

export type ModelProvider = "google";

// Extract the model ID type from the providers' function parameters
export type GoogleGenerativeAIModelId =
  Parameters<GoogleGenerativeAIProvider>[0];
export type OllamaModelId = "duckdb-nsql"; // Parameters<OllamaProvider>[0];

export const AI_PROVIDERS = ["google"] as const;
export const AiProvider = z.enum(AI_PROVIDERS);
export type AiProvider = z.infer<typeof AiProvider>;

export type AIModelConfig = {
  provider: "google";
  modelId: GoogleGenerativeAIModelId;
  metadata?: {
    useSearchGrounding?: boolean;
  };
};

export type AIProviderConfig = {
  provider: AiProvider;
  apiKey: string;
  url?: string;
};

export function getModel(props: {
  modelConfig: AIModelConfig;
  providerConfig: AIProviderConfig;
}): LanguageModel {
  const { modelConfig, providerConfig } = props;
  switch (modelConfig.provider) {
    case "google":
      return createGoogleGenerativeAI({
        apiKey: providerConfig.apiKey,
        baseURL: providerConfig.url,
      })(modelConfig.modelId, {
        useSearchGrounding: modelConfig.metadata?.useSearchGrounding ?? false,
      });
    default:
      throw new Error(`Unsupported provider: ${JSON.stringify(modelConfig)}`);
  }
}
export type { Tool } from "ai";

export type AiProviderName = ReturnType<typeof getModel>["provider"];
