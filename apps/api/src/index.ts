import { createApp } from "@/app";
import { createDb } from "@/db/db";
import { env } from "@/env";
import type { Logger as DrizzleLogger } from "drizzle-orm";
import { type Logger, createLogger } from "logger";

const logger = createLogger({
  level: env.LOG_LEVEL,
  name: "api",
});

const drizzleLoggerAdapter = (logger: Logger): DrizzleLogger => {
  return {
    logQuery: (query, params) => {
      logger.info({ msg: "Query", query, params });
    },
  };
};

const db = createDb({
  logger: drizzleLoggerAdapter(logger),
  dbUrl: env.DATABASE_URL,
});

const app = await createApp({
  db,
  logger,
});

export default {
  port: 3001,
  fetch: app.fetch,
  idleTimeout: 60,
};
