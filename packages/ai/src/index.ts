import type { Message } from "ai";

import { z } from "zod";

export type {
	TextUIPart,
	ReasoningUIPart,
	ToolInvocationUIPart,
	SourceUIPart,
} from "@ai-sdk/ui-utils";
export * from "./aiClient";
export * from "./providers";
export * from "ai";

/**
 * /**
A JSON value can be a string, number, boolean, object, array, or null.
JSON values can be serialized and deserialized by the JSON.stringify and JSON.parse methods.
 */
/*
 */
export const MessageSchema = z.custom<Omit<Message, "data" | "annotations">>();
