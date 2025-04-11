import { CharacterSchema } from "../db/schema";
import type { AiClient } from "./aiClient";

export const generateCharacterPic = async (props: {
  aiClient: AiClient;
  prompt: string;
}) => {
  const { aiClient, prompt } = props;

  const response = await aiClient.generateText({
    model: aiClient.getModel({
      modelId: "gemini-2.0-flash-exp",
      provider: "google",
    }),
    providerOptions: {
      google: { responseModalities: ["IMAGE", "TEXT"] },
    },
    temperature: 1,
    prompt: prompt,
  });
  console.log({
    msg: "qqqqqqqqq",
    response: response.files.length,
  });
  for (const file of response.files) {
    console.log({
      file,
    });
    if (file.mimeType.startsWith("image/")) {
      // The file object provides multiple data formats:
      // Access images as base64 string, Uint8Array binary data, or check type
      // - file.base64: string (data URL format)
      // - file.uint8Array: Uint8Array (binary data)
      // - file.mimeType: string (e.g. "image/png")
      return file.base64;
    }
  }
  throw new Error("No image found in response");
};

export const generateCharacterSheet = async (props: {
  aiClient: AiClient;
  prompt: string;
}) => {
  const { aiClient, prompt } = props;

  const response = await aiClient.generateObject({
    model: aiClient.getModel({
      modelId: "gemini-2.0-flash-exp",
      provider: "google",
    }),
    system:
      "You are a character builder. You will be given a prompt and you will need to generate a character attributes sheet in json format.",
    prompt: prompt,
    schema: CharacterSchema,
  });

  return response.object;
};
