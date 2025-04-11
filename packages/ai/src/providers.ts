import { createAnthropic } from "@ai-sdk/anthropic";
import type { AnthropicProvider } from "@ai-sdk/anthropic";
import {
	type GoogleGenerativeAIProvider,
	createGoogleGenerativeAI,
} from "@ai-sdk/google";
import { type GroqProvider, createGroq } from "@ai-sdk/groq";
import {
	type OpenRouterProvider,
	createOpenRouter,
} from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";
import { type OllamaProvider, createOllama } from "ollama-ai-provider";
import { z } from "zod";

export type ModelProvider =
	| "groq"
	| "openrouter"
	| "anthropic"
	| "google"
	| "ollama";

// Extract the model ID type from the providers' function parameters
export type AnthropicModelId = Parameters<AnthropicProvider>[0];
export type GroqModelId = Parameters<GroqProvider>[0];
export type OpenRouterModelId = Parameters<OpenRouterProvider>[0];
export type GoogleGenerativeAIModelId =
	Parameters<GoogleGenerativeAIProvider>[0];
export type OllamaModelId = "duckdb-nsql"; // Parameters<OllamaProvider>[0];
export type AllOllamaModels = Parameters<OllamaProvider>[0];

export const AI_PROVIDERS = [
	"google",
	"anthropic",
	"openrouter",
	"ollama",
	"groq",
] as const;
export const AiProvider = z.enum(AI_PROVIDERS);
export type AiProvider = z.infer<typeof AiProvider>;

export type AIModelConfig =
	| {
			provider: "anthropic";
			modelId: AnthropicModelId;
	  }
	| {
			provider: "groq";
			modelId: GroqModelId;
	  }
	| {
			provider: "openrouter";
			modelId: OpenRouterModelId;
	  }
	| {
			provider: "google";
			modelId: GoogleGenerativeAIModelId;
			metadata?: {
				useSearchGrounding?: boolean;
			};
	  }
	| {
			provider: "ollama";
			modelId: OllamaModelId;
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
		case "anthropic":
			return createAnthropic({
				apiKey: providerConfig.apiKey,
				baseURL: providerConfig.url,
			})(modelConfig.modelId, { cacheControl: true });
		case "groq":
			return createGroq({
				apiKey: providerConfig.apiKey,
				baseURL: providerConfig.url,
			})(modelConfig.modelId);
		case "openrouter":
			return createOpenRouter({
				apiKey: providerConfig.apiKey,
				baseURL: providerConfig.url,
			})(modelConfig.modelId);
		case "google":
			return createGoogleGenerativeAI({
				apiKey: providerConfig.apiKey,
				baseURL: providerConfig.url,
			})(modelConfig.modelId, {
				useSearchGrounding: modelConfig.metadata?.useSearchGrounding ?? false,
			});
		case "ollama":
			return createOllama({
				baseURL: providerConfig.url,
			})(modelConfig.modelId);
		default:
			throw new Error(`Unsupported provider: ${JSON.stringify(modelConfig)}`);
	}
}
export type { Tool } from "ai";

export type AiProviderName = ReturnType<typeof getModel>["provider"];
