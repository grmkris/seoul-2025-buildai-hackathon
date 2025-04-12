import { LoggerLevel } from "logger";
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_ENV: z.enum(["dev", "prod"]).default("dev"),
  LOG_LEVEL: LoggerLevel,
  DATABASE_URL: z
    .string()
    .default("postgres://postgres:postgres@localhost:54322/postgres"),
  EMAIL_PROVIDER: z.enum(["console", "smtp", "resend"]).default("console"),

  // if email provider is smtp
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.preprocess(Number, z.number()).default(587),
  SMTP_USERNAME: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_SECURE: z
    .preprocess((v) => v === "true" || v === "1", z.boolean())
    .default(true),

  BETTER_AUTH_SECRET: z.string(),

  // always required regardless of email provider
  EMAIL_FROM: z.string().default("hello@example.com"),

  STANDALONE: z.coerce.number().default(0),
  VITE_DATABASE_URL: z.string().optional(),
  VITE_BLOB_READ_WRITE_TOKEN: z.string().optional(),
  VITE_OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string(),
  GOOGLE_GEMINI_API_KEY: z.string(),

  OPEN_OBSERVE_ENDPOINT: z.string(),
  OPEN_OBSERVE_PASSWORD: z.string(),
  OPEN_OBSERVE_USERNAME: z.string(),

  STORAGE_BUCKET: z.string(),
  STORAGE_ACCESS_KEY: z.string(),
  STORAGE_SECRET_KEY: z.string(),
  STORAGE_REGION: z.string(),
  STORAGE_ENDPOINT: z.string(),
  GROQ_API_KEY: z.string(),

  TEST_RPC_URL: z.string(),
  TRANSFERS_CONTRACT_ADDRESS: z.string(),
  MOCK_TOKEN_ADDRESS: z.string(),
  OPERATOR_PRIVATE_KEY: z.string(),
  RECIPIENT_ADDRESS: z.string(),
});

export const env = envSchema.parse(Bun.env);
