import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  GOOGLE_GEMINI_API_KEY: z.string(),
  LITERAL_API_KEY: z.string(),
  PRIVATE_KEY: z.string(),
  SERVER_BASE_URL: z.string().url(),
});

export const serverEnv = envSchema.parse(process.env);
