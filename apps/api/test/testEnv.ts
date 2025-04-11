import { LOGGER_LEVELS } from "logger";
import { z } from "zod";
export const TestEnvSchema = z.object({
  LOG_LEVEL: z.enum(LOGGER_LEVELS).default("info"),
});

export const testEnv = TestEnvSchema.parse(Bun.env);
